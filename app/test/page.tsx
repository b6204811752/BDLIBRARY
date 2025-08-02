'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { practiceTests, createTestAttempt, saveTestAttempt, calculateScore, TestAttempt, TestSet } from '@/lib/practice-tests';

export default function TestPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('id') || 'ssc-cgl-mock-1';
  
  const [test, setTest] = useState<TestSet | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const foundTest = practiceTests.find(t => t.id === testId);
    if (foundTest) {
      setTest(foundTest);
    }
  }, [testId]);

  useEffect(() => {
    if (isTestStarted && timeLeft > 0 && !isTestCompleted) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTestStarted, isTestCompleted]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    if (!test) return;
    
    const attempt = createTestAttempt(test.id, 'current-student');
    setCurrentAttempt(attempt);
    setTimeLeft(test.duration * 60);
    setIsTestStarted(true);
    setShowInstructions(false);
    setCurrentQuestionIndex(0);
    saveTestAttempt(attempt);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (!currentAttempt || isTestCompleted) return;

    const updatedAttempt = {
      ...currentAttempt,
      answers: {
        ...currentAttempt.answers,
        [questionId]: answerIndex
      }
    };

    setCurrentAttempt(updatedAttempt);
    saveTestAttempt(updatedAttempt);
  };

  const handleTimeUp = () => {
    if (currentAttempt && test) {
      submitTest();
    }
  };

  const submitTest = () => {
    if (!currentAttempt || !test) return;

    const score = calculateScore(currentAttempt, test);
    const percentage = (score / test.totalMarks) * 100;

    const completedAttempt = {
      ...currentAttempt,
      endTime: new Date(),
      score,
      percentage,
      status: 'completed' as const
    };

    setCurrentAttempt(completedAttempt);
    saveTestAttempt(completedAttempt);
    setIsTestCompleted(true);
    setShowResults(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            {language === 'en' ? test.name : test.nameHindi}
          </h1>
          
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Test Details:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                <div>Total Questions: {test.totalQuestions}</div>
                <div>Duration: {test.duration} minutes</div>
                <div>Total Marks: {test.totalMarks}</div>
                <div>Difficulty: {test.difficulty}</div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Each question carries 2 marks</li>
                <li>There is no negative marking</li>
                <li>You can navigate between questions using the question palette</li>
                <li>You can change your answers anytime before submission</li>
                <li>Test will auto-submit when time expires</li>
                <li>Toggle between English and Hindi using the language button</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {language === 'en' ? 'हिंदी में देखें' : 'View in English'}
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={() => window.close()}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={startTest}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && currentAttempt) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h2>
              <p className="text-gray-600">{language === 'en' ? test.name : test.nameHindi}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentAttempt.score}</div>
                <div className="text-sm text-blue-800">Your Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentAttempt.percentage?.toFixed(1)}%</div>
                <div className="text-sm text-green-800">Percentage</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Object.keys(currentAttempt.answers).length}
                </div>
                <div className="text-sm text-yellow-800">Attempted</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(currentAttempt.answers).filter(qId => {
                    const question = test.questions.find(q => q.id === qId);
                    return question && currentAttempt.answers[qId] === question.correctAnswer;
                  }).length}
                </div>
                <div className="text-sm text-purple-800">Correct</div>
              </div>
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                {language === 'en' ? 'हिंदी में देखें' : 'View in English'}
              </button>
              <button
                onClick={() => window.close()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close Test
              </button>
            </div>
          </div>

          {/* Detailed Question Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Question Analysis</h3>
            
            <div className="space-y-4">
              {test.questions.slice(0, 10).map((question, index) => {
                const userAnswer = currentAttempt.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAttempted = userAnswer !== undefined;

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">Q{index + 1}.</span>
                      <div className="flex items-center space-x-2">
                        {wasAttempted ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            Not Attempted
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-900 font-medium mb-3">
                      {language === 'en' ? question.question : question.questionHindi}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded border text-sm ${
                            optIndex === question.correctAnswer
                              ? 'bg-green-100 border-green-300 text-green-800'
                              : optIndex === userAnswer
                              ? 'bg-red-100 border-red-300 text-red-800'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>{' '}
                          {language === 'en' ? option : question.optionsHindi[optIndex]}
                          {optIndex === question.correctAnswer && ' ✓'}
                          {optIndex === userAnswer && optIndex !== question.correctAnswer && ' ✗'}
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-medium text-blue-900 mb-1">Explanation:</h4>
                      <p className="text-sm text-blue-800">
                        {language === 'en' ? question.explanation : question.explanationHindi}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {test.questions.length > 10 && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Showing first 10 questions. Total questions: {test.questions.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isTestStarted && currentAttempt) {
    const currentQuestion = test.questions[currentQuestionIndex];
    const userAnswer = currentAttempt.answers[currentQuestion.id];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'en' ? test.name : test.nameHindi}
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {test.totalQuestions}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
                <div className="text-xs text-gray-500">Time Left</div>
              </div>
              
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {currentQuestion.marks} marks
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-lg text-gray-900 mb-4">
                    {language === 'en' ? currentQuestion.question : currentQuestion.questionHindi}
                  </p>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          userAnswer === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            userAnswer === index
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {userAnswer === index && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span className="text-gray-900">
                            {language === 'en' ? option : currentQuestion.optionsHindi[index]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Submit Test
                  </button>

                  <button
                    onClick={() => setCurrentQuestionIndex(Math.min(test.totalQuestions - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === test.totalQuestions - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Question Palette */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4">Question Palette</h3>
                
                <div className="grid grid-cols-5 gap-2">
                  {test.questions.map((question, index) => {
                    const isAnswered = currentAttempt.answers[question.id] !== undefined;
                    return (
                      <button
                        key={question.id}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-10 h-10 rounded text-sm font-medium ${
                          currentQuestionIndex === index
                            ? 'ring-2 ring-blue-500'
                            : ''
                        } ${
                          isAnswered
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Answered ({Object.keys(currentAttempt.answers).length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Not Answered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Test?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to submit the test? You have answered{' '}
                {Object.keys(currentAttempt.answers).length} out of {test.totalQuestions} questions.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSubmitConfirm(false);
                    submitTest();
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
