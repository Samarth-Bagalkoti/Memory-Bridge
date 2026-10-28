const express = require('express');
const router = express.Router();
const aiToolsService = require('../services/aiToolsService');
const { GoogleGenAI } = require('@google/genai');

// System Instruction for Memory Bridge AI Companion
const SYSTEM_PROMPT = `You are Memory Bridge, a calm, reassuring, and friendly assistance companion for an elderly user (Sanjay Singhania).
Guidelines:
1. Use simple, warm, clear, and reassuring language suitable for elderly care.
2. Keep answers short (1 to 3 sentences maximum) so they are easy to listen to via SpeechSynthesis.
3. NEVER invent patient-specific facts, names, dosages, or schedules.
4. For medication, appointments, family members, memories, routines, alerts, and current location, USE ONLY the verified Memory Bridge application data provided in the context.
5. MEDICAL SAFETY: For medications, report only the exact stored name, timing, and dosage. Never prescribe medicine, suggest dosage changes, diagnose illnesses, or offer medical treatment advice.
6. If asked "What should I do now?", check the priority pending medication or next incomplete routine task.`;

// Local Rule-Based Fallback Parser if AI API is unconfigured or offline
function processFallbackQuery(query, context) {
  const q = (query || '').toLowerCase().trim();
  const { patient, people, memories, medications, routines, appointments, peopleMetToday } = context;

  // Question: Who is Roohi?
  if (q.includes('roohi')) {
    const p = people.find(person => person.name.toLowerCase().includes('roohi'));
    return p
      ? `Roohi is your daughter. ${p.notes || 'She calls you every evening at 6:00 PM.'}`
      : 'Roohi is your loving daughter. She calls you every evening.';
  }

  // Question: Who is Vansh?
  if (q.includes('vansh')) {
    const p = people.find(person => person.name.toLowerCase().includes('vansh'));
    return p
      ? `Vansh is your son. ${p.notes || 'He visits you on Sundays for lunch.'}`
      : 'Vansh is your son who visits on Sundays.';
  }

  // Question: Who is Kalpana / wife?
  if (q.includes('kalpana') || q.includes('wife')) {
    const p = people.find(person => person.name.toLowerCase().includes('kalpana'));
    return p
      ? `Kalpana is your beloved wife. ${p.notes || 'You share morning garden walks together.'}`
      : 'Kalpana is your wife. You share morning walks in the garden.';
  }

  // Question: Caregiver / Meera
  if (q.includes('caregiver') || q.includes('meera')) {
    return 'Meera Sharma is your dedicated caregiver. She assists with morning medicines and health tracking.';
  }

  // Question: Medication inquiry
  if (q.includes('medicine') || q.includes('meds') || q.includes('tablet') || q.includes('pill')) {
    const pending = medications.find(m => !m.taken);
    if (pending) {
      return `Your next scheduled medication is ${pending.name} (${pending.dosage}) at ${pending.time}. ${pending.instructions || 'Take with water.'}`;
    }
    return 'All scheduled medications for today are taken! Great job Sanjay.';
  }

  // Question: Appointment
  if (q.includes('appointment') || q.includes('doctor')) {
    if (appointments && appointments.length > 0) {
      const apt = appointments[0];
      return `You have an appointment: ${apt.title} with ${apt.doctorOrPlace} scheduled for ${apt.time} (${apt.date}).`;
    }
    return 'You have no doctor appointments scheduled for today.';
  }

  // Question: Next task / What should I do now?
  if (q.includes('next task') || q.includes('do now') || q.includes('what should i do')) {
    const pendingMed = medications.find(m => !m.taken);
    const pendingRoutine = routines.find(r => !r.completed);
    if (pendingMed) {
      return `Your priority task right now is taking ${pendingMed.name} scheduled for ${pendingMed.time}.`;
    }
    if (pendingRoutine) {
      return `Your next scheduled activity is ${pendingRoutine.title} at ${pendingRoutine.time}.`;
    }
    return 'All routine activities for today are completed! Relax and enjoy your day.';
  }

  // Question: People met today
  if (q.includes('meet') || q.includes('visited') || q.includes('people met')) {
    if (peopleMetToday && peopleMetToday.length > 0) {
      const names = peopleMetToday.map(pm => `${pm.name} (${pm.relationship})`).join(', ');
      return `Today you met: ${names}.`;
    }
    return 'You met your caregiver Meera Sharma and daughter Roohi today.';
  }

  // Question: Memories / Family stories
  if (q.includes('memory') || q.includes('memories') || q.includes('story')) {
    if (memories && memories.length > 0) {
      const mem = memories[0];
      return `Here is a special memory: "${mem.title}" - ${mem.story}`;
    }
    return 'You have wonderful memories of your family trip to Shimla and university celebrations.';
  }

  return `Hello ${patient.name}! I am your Memory Bridge AI companion. You can ask me about your medications, schedule, family members like Roohi, or what to do next!`;
}

// POST /api/ai/assistant
router.post('/assistant', async (req, res) => {
  const { query, conversationHistory, clientSyncData } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Compile ground-truth patient context from backend & client sync
  const context = aiToolsService.getFullContextSummary(clientSyncData);

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  // Fallback if API key is not configured in backend .env
  if (!apiKey) {
    const fallbackAnswer = processFallbackQuery(query, context);
    return res.json({
      answer: fallbackAnswer,
      intent: 'natural_language_query',
      fallbackUsed: true,
      reason: 'Backend AI API key not configured in .env'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Build context prompt
    const formattedContext = JSON.stringify(context, null, 2);

    let historyPrompt = '';
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      historyPrompt = '\nRECENT CONVERSATION HISTORY:\n' + conversationHistory.slice(-4).map(turn => `${turn.role.toUpperCase()}: ${turn.content}`).join('\n') + '\n';
    }

    const userPrompt = `PATIENT VERIFIED APPLICATION DATA:
${formattedContext}

${historyPrompt}
USER QUESTION: "${query}"

Provide a warm, short, clear 1-3 sentence response using only the patient's verified application data above.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2 // Low temperature for high accuracy & medical safety
      }
    });

    const aiText = response.text ? response.text.trim() : null;

    if (aiText) {
      return res.json({
        answer: aiText,
        intent: 'ai_natural_language',
        fallbackUsed: false
      });
    }

    throw new Error('Empty response from AI model');
  } catch (err) {
    console.warn('Backend AI API error, switching to fallback parser:', err.message);
    const fallbackAnswer = processFallbackQuery(query, context);
    return res.json({
      answer: fallbackAnswer,
      intent: 'natural_language_fallback',
      fallbackUsed: true,
      error: err.message
    });
  }
});

module.exports = router;
