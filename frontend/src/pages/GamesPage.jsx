import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Brain, Trophy, Sparkles, CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Volume2 } from 'lucide-react';

export const GamesPage = () => {
  const { speak, getTextSizeClass, highContrast } = useAccessibility();
  const [activeGame, setActiveGame] = useState(null); // 'who_is_this', 'family_memory', 'remember_numbers', 'place_recognition'
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [people, setPeople] = useState([]);

  // Session state (RESET TO ZERO ON EVERY NEW GAME)
  const [sessionScore, setSessionScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lastAnswerResult, setLastAnswerResult] = useState(null); // { isCorrect: bool, correctText: string }
  const [feedback, setFeedback] = useState(null);

  // Game 1: Who Is This?
  const [game1Index, setGame1Index] = useState(0);
  const [game1Questions, setGame1Questions] = useState([]);

  // Game 2: Family Memory
  const [game2Index, setGame2Index] = useState(0);
  const [game2Questions, setGame2Questions] = useState([]);

  // Game 3: Remember Numbers
  const [numberSequence, setNumberSequence] = useState([]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [userInputDigits, setUserInputDigits] = useState('');

  // Game 4: Place Recognition
  const [game4Index, setGame4Index] = useState(0);
  const [game4Questions, setGame4Questions] = useState([]);

  useEffect(() => {
    initGamesData();
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    const perf = await api.getGamePerformance();
    if (perf && perf.currentDifficultyLevel) {
      setDifficultyLevel(perf.currentDifficultyLevel);
    }
  };

  const initGamesData = async () => {
    const pList = await api.getPeople();
    setPeople(pList);

    const roohi = pList.find(p => p.name.toLowerCase().includes('roohi')) || { name: 'Roohi', relationship: 'Daughter', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' };
    const vansh = pList.find(p => p.name.toLowerCase().includes('vansh')) || { name: 'Vansh', relationship: 'Son', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' };
    const kalpana = pList.find(p => p.name.toLowerCase().includes('kalpana')) || { name: 'Kalpana', relationship: 'Wife', photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80' };
    const meera = pList.find(p => p.name.toLowerCase().includes('meera')) || { name: 'Meera Sharma', relationship: 'Caregiver', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' };

    // Setup Game 1 Questions (Who Is This?)
    setGame1Questions([
      {
        person: roohi,
        options: ['Roohi — Daughter', 'Meera — Caregiver', 'Sunita — Neighbor'],
        correctIndex: 0,
        correctText: 'Roohi — your daughter'
      },
      {
        person: kalpana,
        options: ['Ananya — Friend', 'Kalpana — Wife', 'Roohi — Daughter'],
        correctIndex: 1,
        correctText: 'Kalpana — your wife'
      },
      {
        person: vansh,
        options: ['Vansh — Son', 'Vikram — Friend', 'Dr. Vasudev'],
        correctIndex: 0,
        correctText: 'Vansh — your son'
      },
      {
        person: meera,
        options: ['Kalpana — Wife', 'Meera — Caregiver', 'Roohi — Daughter'],
        correctIndex: 1,
        correctText: 'Meera Sharma — your caregiver'
      }
    ]);

    // Setup Game 2 Questions (Family Memory)
    setGame2Questions([
      {
        question: 'Who calls you every evening at 6:00 PM?',
        options: ['Your Daughter Roohi', 'Your Son Vansh', 'Doctor Vasudev'],
        correctIndex: 0,
        correctText: 'Your Daughter Roohi'
      },
      {
        question: 'Who visits you every Sunday for lunch?',
        options: ['Your Caregiver Meera', 'Your Son Vansh', 'Neighbor Mr. Gupta'],
        correctIndex: 1,
        correctText: 'Your Son Vansh'
      },
      {
        question: 'Who shares morning walks in the garden with you?',
        options: ['Roohi', 'Your Wife Kalpana', 'Doctor Vasudev'],
        correctIndex: 1,
        correctText: 'Your Wife Kalpana'
      }
    ]);

    // Setup Game 4 Questions (Place Recognition)
    setGame4Questions([
      {
        title: 'Family Villa in Shimla',
        imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=500&q=80',
        question: 'Which place is this cozy mountain house?',
        options: ['Family Villa in Shimla', 'City Hospital', 'Airport Terminal'],
        correctIndex: 0,
        correctText: 'Family Villa in Shimla'
      },
      {
        title: 'Old Town Courtyard',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80',
        question: 'Which memory place is this ancestral courtyard?',
        options: ['Shopping Mall', 'Old Town Courtyard', 'Bus Station'],
        correctIndex: 1,
        correctText: 'Old Town Courtyard'
      }
    ]);
  };

  // Helper to start a NEW game session (FIX FOR BUG 9: RESET ALL COUNTERS TO ZERO)
  const startNewGameSession = (gameType) => {
    setActiveGame(gameType);
    setSessionScore(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setLastAnswerResult(null);
    setFeedback(null);

    if (gameType === 'who_is_this') setGame1Index(0);
    if (gameType === 'family_memory') setGame2Index(0);
    if (gameType === 'place_recognition') setGame4Index(0);
    if (gameType === 'remember_numbers') startNumberGameRound(difficultyLevel);
  };

  // Start Number Memory Round (Game 3)
  const startNumberGameRound = (level = difficultyLevel) => {
    const digitCount = level === 1 ? 3 : level === 2 ? 4 : 5;
    const newSeq = Array.from({ length: digitCount }, () => Math.floor(Math.random() * 9) + 1);
    setNumberSequence(newSeq);
    setShowNumbers(true);
    setUserInputDigits('');
    setLastAnswerResult(null);

    // Hide sequence after 3.5 seconds
    setTimeout(() => {
      setShowNumbers(false);
    }, 3500);
  };

  // Process an answer selection
  const handleAnswerSubmit = (isCorrect, correctText, currentQIndex, totalQCount, nextQuestionCallback, gameId, gameName) => {
    const newAnswered = questionsAnswered + 1;
    const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;

    setQuestionsAnswered(newAnswered);
    setCorrectAnswers(newCorrect);
    setLastAnswerResult({ isCorrect, correctText });

    if (isCorrect) {
      speak('✅ Correct! Well done, Sanjay!');
    } else {
      speak(`❌ Not quite. The correct answer was ${correctText}.`);
    }

    // Wait 1.8 seconds to show answer verification before moving to next question or session end
    setTimeout(() => {
      setLastAnswerResult(null);
      if (currentQIndex + 1 < totalQCount) {
        nextQuestionCallback();
      } else {
        handleCompleteSession(gameId, gameName, newCorrect, totalQCount);
      }
    }, 1800);
  };

  // Complete Game Session & Calculate Adaptive Difficulty
  const handleCompleteSession = async (gameId, gameName, finalCorrect, totalCount) => {
    const accuracy = Math.round((finalCorrect / totalCount) * 100);

    const res = await api.saveGameSession({
      gameId,
      gameName,
      score: accuracy,
      accuracy,
      responseTimeSec: 3.8,
      currentDifficulty: difficultyLevel
    });

    const nextDiff = res.adaptiveFeedback?.nextDifficultyLevel || difficultyLevel;
    setDifficultyLevel(nextDiff);
    setFeedback({
      accuracy,
      correctCount: finalCorrect,
      totalCount,
      message: res.adaptiveFeedback?.message || 'Great game session activity!',
      nextLevel: nextDiff
    });

    speak(`Round completed! You got ${finalCorrect} out of ${totalCount} correct. ${res.adaptiveFeedback?.message || ''}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn pb-24">
      
      {/* Header */}
      <div className="border-b border-amber-200/80 pb-6">
        <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-1">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>COGNITIVE ENGAGEMENT & MEMORY ACTIVITY</span>
        </div>
        <h1 className={`font-black ${getTextSizeClass('text-4xl')} text-emerald-950`}>
          Mind & Memory Games 🎮
        </h1>
        <p className="text-slate-600 font-medium text-base mt-1">
          Enjoyable memory activities tailored for Sanjay Singhania.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-900 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Current Adaptive Difficulty: Level {difficultyLevel}</span>
        </div>
      </div>

      {/* GAME SELECTOR MENU */}
      {!activeGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Game 1 */}
          <button
            onClick={() => startNewGameSession('who_is_this')}
            className="p-6 rounded-3xl bg-white border-2 border-emerald-300 hover:border-emerald-500 shadow-xl hover:scale-105 transition-all text-left group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950 mb-2`}>
              1. WHO IS THIS?
            </h3>
            <p className="text-slate-600 font-medium text-sm">
              Recognize familiar photos of Roohi, Vansh, Kalpana, and Meera.
            </p>
          </button>

          {/* Game 2 */}
          <button
            onClick={() => startNewGameSession('family_memory')}
            className="p-6 rounded-3xl bg-white border-2 border-amber-300 hover:border-amber-500 shadow-xl hover:scale-105 transition-all text-left group"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              ❤️
            </div>
            <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950 mb-2`}>
              2. FAMILY MEMORY GAME
            </h3>
            <p className="text-slate-600 font-medium text-sm">
              Answer questions about your family routines and cherished moments.
            </p>
          </button>

          {/* Game 3 */}
          <button
            onClick={() => startNewGameSession('remember_numbers')}
            className="p-6 rounded-3xl bg-white border-2 border-blue-300 hover:border-blue-500 shadow-xl hover:scale-105 transition-all text-left group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🔢
            </div>
            <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950 mb-2`}>
              3. REMEMBER THE NUMBERS
            </h3>
            <p className="text-slate-600 font-medium text-sm">
              Memorize a sequence of numbers (3 to 5 digits) and test your recall!
            </p>
          </button>

          {/* Game 4 */}
          <button
            onClick={() => startNewGameSession('place_recognition')}
            className="p-6 rounded-3xl bg-white border-2 border-purple-300 hover:border-purple-500 shadow-xl hover:scale-105 transition-all text-left group"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🏠
            </div>
            <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950 mb-2`}>
              4. PLACE RECOGNITION
            </h3>
            <p className="text-slate-600 font-medium text-sm">
              Recognize photos of familiar places like your Shimla Villa & Courtyard.
            </p>
          </button>
        </div>
      )}

      {/* GAME 1 BOARD: WHO IS THIS? */}
      {activeGame === 'who_is_this' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-300 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="font-extrabold text-sm text-emerald-700">
              Game 1 • Who Is This? (Question {game1Index + 1} of {game1Questions.length})
            </span>
            <button onClick={() => setActiveGame(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
              ← Main Games Menu
            </button>
          </div>

          {!feedback ? (
            game1Questions[game1Index] && (
              <div className="space-y-6 text-center">
                <img
                  src={game1Questions[game1Index].person.photoUrl}
                  alt="Who is this?"
                  className="w-56 h-56 rounded-3xl object-cover mx-auto border-4 border-emerald-400 shadow-xl"
                />

                <h2 className={`font-black ${getTextSizeClass('text-3xl')} text-emerald-950`}>
                  Who is this familiar person?
                </h2>

                {/* Answer Feedback Banner */}
                {lastAnswerResult && (
                  <div className={`p-4 rounded-2xl border font-bold text-lg animate-fadeIn max-w-md mx-auto ${
                    lastAnswerResult.isCorrect ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                  }`}>
                    {lastAnswerResult.isCorrect ? (
                      <p>✅ Correct! Well done, Sanjay!</p>
                    ) : (
                      <p>❌ Not quite. The correct answer was {lastAnswerResult.correctText}.</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                  {game1Questions[game1Index].options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={!!lastAnswerResult}
                      onClick={() => {
                        const isCorrect = idx === game1Questions[game1Index].correctIndex;
                        handleAnswerSubmit(
                          isCorrect,
                          game1Questions[game1Index].correctText,
                          game1Index,
                          game1Questions.length,
                          () => setGame1Index(game1Index + 1),
                          'who_is_this',
                          'Who Is This?'
                        );
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xl border-2 border-emerald-200 transition-all hover:scale-105 disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-6 space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h2 className="font-black text-3xl text-emerald-950">Round Completed!</h2>
              <p className="text-xl font-bold text-slate-700">
                Score: {feedback.correctCount} / {feedback.totalCount} ({feedback.accuracy}%)
              </p>
              <p className="text-sm font-semibold text-purple-700 bg-purple-50 p-3 rounded-xl border border-purple-200 max-w-md mx-auto">
                {feedback.message}
              </p>
              <button
                onClick={() => setActiveGame(null)}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg shadow"
              >
                Back to Games Menu
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2 BOARD: FAMILY MEMORY */}
      {activeGame === 'family_memory' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="font-extrabold text-sm text-amber-700">
              Game 2 • Family Memory Game (Question {game2Index + 1} of {game2Questions.length})
            </span>
            <button onClick={() => setActiveGame(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
              ← Main Games Menu
            </button>
          </div>

          {!feedback ? (
            game2Questions[game2Index] && (
              <div className="space-y-6 text-center max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto shadow-inner">
                  ❤️
                </div>

                <h2 className={`font-black ${getTextSizeClass('text-3xl')} text-amber-950`}>
                  {game2Questions[game2Index].question}
                </h2>

                {/* Answer Feedback Banner */}
                {lastAnswerResult && (
                  <div className={`p-4 rounded-2xl border font-bold text-lg animate-fadeIn ${
                    lastAnswerResult.isCorrect ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                  }`}>
                    {lastAnswerResult.isCorrect ? (
                      <p>✅ Correct! Well done, Sanjay!</p>
                    ) : (
                      <p>❌ Not quite. The correct answer was {lastAnswerResult.correctText}.</p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {game2Questions[game2Index].options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={!!lastAnswerResult}
                      onClick={() => {
                        const isCorrect = idx === game2Questions[game2Index].correctIndex;
                        handleAnswerSubmit(
                          isCorrect,
                          game2Questions[game2Index].correctText,
                          game2Index,
                          game2Questions.length,
                          () => setGame2Index(game2Index + 1),
                          'family_memory',
                          'Family Memory Game'
                        );
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-xl border-2 border-amber-200 transition-all hover:scale-105 disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-6 space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h2 className="font-black text-3xl text-emerald-950">Round Completed!</h2>
              <p className="text-xl font-bold text-slate-700">
                Score: {feedback.correctCount} / {feedback.totalCount} ({feedback.accuracy}%)
              </p>
              <button
                onClick={() => setActiveGame(null)}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg shadow"
              >
                Back to Games Menu
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 3 BOARD: REMEMBER THE NUMBERS */}
      {activeGame === 'remember_numbers' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-blue-300 shadow-xl space-y-6 text-center">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="font-extrabold text-sm text-blue-700">
              Game 3 • Remember The Numbers (Level {difficultyLevel} = {difficultyLevel + 2} Digits)
            </span>
            <button onClick={() => setActiveGame(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
              ← Main Games Menu
            </button>
          </div>

          {showNumbers ? (
            <div className="py-8 space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                MEMORIZE THIS NUMBER SEQUENCE:
              </span>
              <div className="flex items-center justify-center gap-4 text-5xl sm:text-6xl font-black text-blue-900 tracking-widest">
                {numberSequence.map((num, idx) => (
                  <span key={idx} className="w-16 h-20 bg-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-300 shadow-inner">
                    {num}
                  </span>
                ))}
              </div>
              <p className="text-xs text-amber-700 font-bold animate-pulse">Numbers will hide in 3 seconds...</p>
            </div>
          ) : !feedback ? (
            <div className="py-6 space-y-6 max-w-md mx-auto">
              <h3 className="font-black text-2xl text-slate-800">Enter the sequence of numbers you saw:</h3>
              <input
                type="text"
                value={userInputDigits}
                onChange={(e) => setUserInputDigits(e.target.value)}
                placeholder="e.g. 382"
                className="w-full text-center text-4xl font-black tracking-widest py-4 rounded-2xl border-4 border-blue-400 focus:ring-4 focus:ring-blue-200"
              />

              <button
                onClick={() => {
                  const targetStr = numberSequence.join('');
                  const isMatch = userInputDigits.trim() === targetStr;
                  handleCompleteSession('remember_numbers', 'Remember The Numbers', isMatch ? 1 : 0, 1);
                }}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-lg"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="py-6 space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
              <h2 className="font-black text-3xl text-slate-900">
                {feedback.accuracy === 100 ? '✅ Correct! Perfect Recall, Sanjay 🎉' : '❌ Not quite. Good attempt!'}
              </h2>
              <p className="text-sm font-semibold text-purple-700 bg-purple-50 p-3 rounded-xl border border-purple-200 max-w-md mx-auto">
                {feedback.message}
              </p>
              <button
                onClick={() => setActiveGame(null)}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg shadow"
              >
                Back to Games Menu
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 4 BOARD: PLACE RECOGNITION */}
      {activeGame === 'place_recognition' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-purple-300 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="font-extrabold text-sm text-purple-700">
              Game 4 • Place Recognition (Question {game4Index + 1} of {game4Questions.length})
            </span>
            <button onClick={() => setActiveGame(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
              ← Main Games Menu
            </button>
          </div>

          {!feedback ? (
            game4Questions[game4Index] && (
              <div className="space-y-6 text-center">
                <img
                  src={game4Questions[game4Index].imageUrl}
                  alt="Familiar Place"
                  className="w-full max-w-md h-56 rounded-3xl object-cover mx-auto border-4 border-purple-300 shadow-xl"
                />

                <h2 className={`font-black ${getTextSizeClass('text-3xl')} text-purple-950`}>
                  {game4Questions[game4Index].question}
                </h2>

                {/* Answer Feedback Banner */}
                {lastAnswerResult && (
                  <div className={`p-4 rounded-2xl border font-bold text-lg animate-fadeIn max-w-md mx-auto ${
                    lastAnswerResult.isCorrect ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                  }`}>
                    {lastAnswerResult.isCorrect ? (
                      <p>✅ Correct! Well done, Sanjay!</p>
                    ) : (
                      <p>❌ Not quite. The correct answer was {lastAnswerResult.correctText}.</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                  {game4Questions[game4Index].options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={!!lastAnswerResult}
                      onClick={() => {
                        const isCorrect = idx === game4Questions[game4Index].correctIndex;
                        handleAnswerSubmit(
                          isCorrect,
                          game4Questions[game4Index].correctText,
                          game4Index,
                          game4Questions.length,
                          () => setGame4Index(game4Index + 1),
                          'place_recognition',
                          'Place Recognition'
                        );
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-black text-xl border-2 border-purple-200 transition-all hover:scale-105 disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-6 space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h2 className="font-black text-3xl text-emerald-950">Round Completed!</h2>
              <p className="text-xl font-bold text-slate-700">
                Score: {feedback.correctCount} / {feedback.totalCount} ({feedback.accuracy}%)
              </p>
              <button
                onClick={() => setActiveGame(null)}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg shadow"
              >
                Back to Games Menu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
