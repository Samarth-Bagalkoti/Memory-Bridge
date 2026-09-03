const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Game performance analytics for caregiver
router.get('/performance/:patientId', (req, res) => {
  const sessions = memoryStore.getGameSessions(req.params.patientId);

  // Compute game accuracy averages
  const gameStats = {};
  sessions.forEach(s => {
    if (!gameStats[s.gameName]) {
      gameStats[s.gameName] = { totalAccuracy: 0, count: 0, lastScore: s.score };
    }
    gameStats[s.gameName].totalAccuracy += s.accuracy;
    gameStats[s.gameName].count += 1;
  });

  const categoryPerformance = Object.keys(gameStats).map(name => ({
    name,
    accuracy: Math.round(gameStats[name].totalAccuracy / gameStats[name].count),
    sessionsCount: gameStats[name].count
  }));

  const overallAccuracy = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length)
    : 80;

  // Determine adaptive trend
  let trend = 'Stable / Good Engagement';
  if (overallAccuracy >= 85) trend = 'Improving / High Engagement';
  else if (overallAccuracy < 60) trend = 'Needs More Support & Gentle Prompts';

  res.json({
    patientId: req.params.patientId,
    overallAccuracy,
    totalGamesCompleted: sessions.length,
    currentDifficultyLevel: sessions[0]?.difficultyLevel || 2,
    trend,
    categoryPerformance,
    recentSessions: sessions.slice(0, 10)
  });
});

// POST Save game session & calculate adaptive difficulty recommendation
router.post('/session', (req, res) => {
  const { gameId, gameName, score, accuracy, responseTimeSec, hintsUsed, currentDifficulty } = req.body;
  
  // Calculate next recommended difficulty based on adaptive rules:
  // Accuracy >= 80% -> Level Up
  // Accuracy 50-79% -> Maintain
  // Accuracy < 50% -> Level Down
  let nextDifficulty = currentDifficulty || 1;
  if (accuracy >= 80 && nextDifficulty < 4) {
    nextDifficulty += 1;
  } else if (accuracy < 50 && nextDifficulty > 1) {
    nextDifficulty -= 1;
  }

  const savedSession = memoryStore.saveGameSession({
    gameId,
    gameName,
    score,
    accuracy,
    responseTimeSec: responseTimeSec || 4,
    hintsUsed: hintsUsed || 0,
    difficultyLevel: nextDifficulty
  });

  res.status(201).json({
    savedSession,
    adaptiveFeedback: {
      nextDifficultyLevel: nextDifficulty,
      message: accuracy >= 80
        ? 'Great job! Moving to the next difficulty level.'
        : accuracy >= 50
        ? 'Good progress! Keeping current difficulty level.'
        : 'Adjusting difficulty to be more comfortable.'
    }
  });
});

module.exports = router;
