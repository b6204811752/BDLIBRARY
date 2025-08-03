'use client';

import { useState, useEffect, useRef } from 'react';
import { TestSet, Question, TestAttempt, practiceTests, createTestAttempt, saveTestAttempt, calculateScore, getStudentAttempts } from '@/lib/practice-tests';

interface PracticeTestProps {
  currentUser: any;
  onTestComplete: (score: number, totalMarks: number) => void;
}

export default function PracticeTest({ currentUser, onTestComplete }: PracticeTestProps) {
  const [selectedTest, setSelectedTest] = useState<TestSet | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(true);
  const [questionsPerPage, setQuestionsPerPage] = useState(100); // Show all by default
  const [currentPage, setCurrentPage] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if user has completed a test
  const getTestStatus = (testId: string) => {
    const attempts = getStudentAttempts(currentUser.id, testId);
    const completedAttempt = attempts.find(attempt => attempt.status === 'completed');
    return completedAttempt ? { isCompleted: true, attempt: completedAttempt } : { isCompleted: false, attempt: null };
  };

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

  const startTest = (test: TestSet) => {
    const attempt = createTestAttempt(test.id, currentUser.id);
    setCurrentAttempt(attempt);
    setSelectedTest(test);
    setTimeLeft(test.duration * 60);
    setIsTestStarted(true);
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
    if (currentAttempt && selectedTest) {
      submitTest();
    }
  };

  const submitTest = () => {
    if (!currentAttempt || !selectedTest) return;

    const score = calculateScore(currentAttempt, selectedTest);
    const percentage = (score / selectedTest.totalMarks) * 100;

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
    onTestComplete(score, selectedTest.totalMarks);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowQuestionPalette(false);
  };

  const toggleBookmark = (questionId: string) => {
    if (!currentAttempt) return;

    const bookmarked = currentAttempt.bookmarkedQuestions.includes(questionId);
    const updatedBookmarks = bookmarked
      ? currentAttempt.bookmarkedQuestions.filter((id: string) => id !== questionId)
      : [...currentAttempt.bookmarkedQuestions, questionId];

    const updatedAttempt = {
      ...currentAttempt,
      bookmarkedQuestions: updatedBookmarks
    };

    setCurrentAttempt(updatedAttempt);
    saveTestAttempt(updatedAttempt);
  };

  const getQuestionStatus = (question: Question): 'answered' | 'bookmarked' | 'unanswered' => {
    if (!currentAttempt) return 'unanswered';

    const isAnswered = currentAttempt.answers[question.id] !== undefined;
    const isBookmarked = currentAttempt.bookmarkedQuestions.includes(question.id);

    if (isAnswered) return 'answered';
    if (isBookmarked) return 'bookmarked';
    return 'unanswered';
  };

  if (!selectedTest && !showResults) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Practice Tests</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Language: 
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer"
                >
                  {language === 'en' ? 'English' : 'हिंदी'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceTests.filter(test => test.isActive).map((test) => (
              <div key={test.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'en' ? test.name : test.nameHindi}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {test.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {language === 'en' ? test.description : test.descriptionHindi}
                </p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{test.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{test.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Marks:</span>
                    <span>{test.totalMarks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{test.category}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {test.subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  {(() => {
                    const testStatus = getTestStatus(test.id);
                    const isCompleted = testStatus.isCompleted;
                    const lastAttempt = testStatus.attempt;
                    
                    return (
                      <>
                        <button
                          onClick={() => {
                            setSelectedTest(test);
                            setShowInstructions(true);
                          }}
                          className={`flex-1 ${isCompleted ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded-md transition-colors cursor-pointer`}
                        >
                          {isCompleted ? 'Retake Test' : 'Start Test'}
                        </button>
                        {isCompleted && lastAttempt && (
                          <button
                            onClick={() => {
                              const selectedTestData = practiceTests.find(t => t.id === test.id);
                              if (selectedTestData) {
                                const score = calculateScore(lastAttempt, selectedTestData);
                                const percentage = ((score / selectedTestData.totalMarks) * 100).toFixed(1);
                                alert(`Last Attempt Results:\n\nScore: ${score}/${selectedTestData.totalMarks} (${percentage}%)\nDate: ${new Date(lastAttempt.endTime || lastAttempt.startTime).toLocaleDateString()}\nTime Taken: ${selectedTestData.duration} minutes\n\nClick 'Retake Test' to attempt again.`);
                              }
                            }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                          >
                            <i className="ri-trophy-line"></i>
                          </button>
                        )}
                      </>
                    );
                  })()}
                  <button 
                    onClick={() => {
                      alert(`Test Information:\n\nName: ${test.name}\nQuestions: ${test.totalQuestions}\nDuration: ${test.duration} minutes\nTotal Marks: ${test.totalMarks}\nDifficulty: ${test.difficulty}\n\nSubjects covered:\n${test.subjects.join(', ')}\n\nThis test includes detailed explanations and bilingual support.`);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    <i className="ri-information-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showInstructions && selectedTest) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Instructions</h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">General Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Total Duration: {selectedTest.duration} minutes</li>
              <li>Total Questions: {selectedTest.totalQuestions}</li>
              <li>Total Marks: {selectedTest.totalMarks}</li>
              <li>Each question carries {selectedTest.questions[0]?.marks || 2} marks</li>
              <li>There is no negative marking</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Navigation:</h3>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>Use Next/Previous buttons to navigate between questions</li>
              <li>Use Question Palette to jump to any question directly</li>
              <li>You can bookmark questions for review</li>
              <li>You can change your answers anytime before submission</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Question Status:</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Bookmarked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Not Visited</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              setShowInstructions(false);
              setSelectedTest(null);
            }}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={() => {
              setShowInstructions(false);
              startTest(selectedTest);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (showResults && currentAttempt && selectedTest) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Results Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h2>
            <p className="text-gray-600">{language === 'en' ? selectedTest.name : selectedTest.nameHindi}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentAttempt.score}</div>
              <div className="text-sm text-blue-800">Score</div>
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
                  const question = selectedTest.questions.find(q => q.id === qId);
                  return question && currentAttempt.answers[qId] === question.correctAnswer;
                }).length}
              </div>
              <div className="text-sm text-purple-800">Correct</div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Question Analysis</h3>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Showing all {selectedTest.questions.length} questions
                </div>
                <select
                  value={questionsPerPage}
                  onChange={(e) => {
                    setQuestionsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-md"
                >
                  <option value={10}>Show 10 per page</option>
                  <option value={25}>Show 25 per page</option>
                  <option value={50}>Show 50 per page</option>
                  <option value={100}>Show all 100 questions</option>
                </select>
              </div>
            </div>
            
            {/* Question Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {Object.keys(currentAttempt.answers).filter(qId => {
                    const question = selectedTest.questions.find((q: any) => q.id === qId);
                    return question && currentAttempt.answers[qId] === question.correctAnswer;
                  }).length}
                </div>
                <div className="text-xs text-green-800">Correct</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">
                  {Object.keys(currentAttempt.answers).filter(qId => {
                    const question = selectedTest.questions.find((q: any) => q.id === qId);
                    return question && currentAttempt.answers[qId] !== undefined && currentAttempt.answers[qId] !== question.correctAnswer;
                  }).length}
                </div>
                <div className="text-xs text-red-800">Incorrect</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">
                  {selectedTest.questions.length - Object.keys(currentAttempt.answers).length}
                </div>
                <div className="text-xs text-gray-800">Not Attempted</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {selectedTest.questions.length}
                </div>
                <div className="text-xs text-blue-800">Total Questions</div>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {(() => {
              const startIndex = (currentPage - 1) * questionsPerPage;
              const endIndex = startIndex + questionsPerPage;
              const currentQuestions = selectedTest.questions.slice(startIndex, endIndex);
              const totalPages = Math.ceil(selectedTest.questions.length / questionsPerPage);
              
              return (
                <>
                  {/* Pagination info */}
                  {questionsPerPage < selectedTest.questions.length && (
                    <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800">
                        Showing questions {startIndex + 1} - {Math.min(endIndex, selectedTest.questions.length)} of {selectedTest.questions.length}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-xs bg-white text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-xs bg-white text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Questions */}
                  {currentQuestions.map((question: any, relativeIndex: number) => {
                    const actualIndex = startIndex + relativeIndex;
                    const userAnswer = currentAttempt.answers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    const wasAttempted = userAnswer !== undefined;

                    return (
                <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
                        Question {actualIndex + 1} of {selectedTest.questions.length}
                      </span>
                      <div className="flex items-center space-x-2">
                        {wasAttempted ? (
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                            ⚪ Not Attempted
                          </span>
                        )}
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {question.marks} marks
                        </span>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {question.subject}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          question.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                          question.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                      className="px-2 py-1 text-xs bg-white text-gray-600 rounded cursor-pointer hover:bg-gray-100"
                    >
                      {language === 'en' ? 'हिंदी' : 'EN'}
                    </button>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-gray-900 font-medium mb-3 text-base leading-relaxed">
                      {language === 'en' ? question.question : question.questionHindi}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded border text-sm ${
                            optIndex === question.correctAnswer
                              ? 'bg-green-100 border-green-300 text-green-800 font-medium'
                              : optIndex === userAnswer
                              ? 'bg-red-100 border-red-300 text-red-800 font-medium'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              <span className="font-bold mr-2">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              {language === 'en' ? option : question.optionsHindi[optIndex]}
                            </span>
                            <div className="flex items-center space-x-2">
                              {optIndex === question.correctAnswer && (
                                <span className="text-green-600 font-bold">✓ Correct Answer</span>
                              )}
                              {optIndex === userAnswer && optIndex !== question.correctAnswer && (
                                <span className="text-red-600 font-bold">✗ Your Answer</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <i className="ri-lightbulb-line mr-2"></i>
                        Detailed Explanation:
                      </h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {language === 'en' ? question.explanation : question.explanationHindi}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
              
              {/* Pagination controls at bottom */}
              {questionsPerPage < selectedTest.questions.length && (
                <div className="flex justify-center items-center mt-6 p-3 bg-blue-50 rounded-lg">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-xs bg-white text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-xs bg-white text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>

        <div className="text-center">
          <button
            onClick={() => {
              setShowResults(false);
              setSelectedTest(null);
              setCurrentAttempt(null);
              setIsTestCompleted(false);
              setIsTestStarted(false);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Take Another Test
          </button>
        </div>
      </div>
    );
  }

  if (isTestStarted && selectedTest && currentAttempt) {
    const currentQuestion = selectedTest.questions[currentQuestionIndex];
    const userAnswer = currentAttempt.answers[currentQuestion.id];

    return (
      <div className="max-w-7xl mx-auto">
        {/* Test Header */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'en' ? selectedTest.name : selectedTest.nameHindi}
              </h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {selectedTest.totalQuestions}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
                <div className="text-xs text-gray-500">Time Left</div>
              </div>
              
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded cursor-pointer"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              
              <button
                onClick={() => setShowQuestionPalette(!showQuestionPalette)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer"
              >
                Question Palette
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {currentQuestion.subject}
                  </span>
                </div>
                
                <button
                  onClick={() => toggleBookmark(currentQuestion.id)}
                  className={`p-2 rounded cursor-pointer ${
                    currentAttempt.bookmarkedQuestions.includes(currentQuestion.id)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <i className="ri-bookmark-line"></i>
                </button>
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

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Previous
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                  >
                    Submit Test
                  </button>
                </div>

                <button
                  onClick={() => setCurrentQuestionIndex(Math.min(selectedTest.totalQuestions - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === selectedTest.totalQuestions - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette */}
          {showQuestionPalette && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
                
                <div className="grid grid-cols-5 gap-2">
                  {selectedTest.questions.map((question, index) => {
                    const status = getQuestionStatus(question);
                    return (
                      <button
                        key={question.id}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-10 h-10 rounded text-sm font-medium cursor-pointer ${
                          currentQuestionIndex === index
                            ? 'ring-2 ring-blue-500'
                            : ''
                        } ${
                          status === 'answered'
                            ? 'bg-green-500 text-white'
                            : status === 'bookmarked'
                            ? 'bg-yellow-500 text-white'
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
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Bookmarked ({currentAttempt.bookmarkedQuestions.length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Not Visited</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Test?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to submit the test? You have answered{' '}
                {Object.keys(currentAttempt.answers).length} out of {selectedTest.totalQuestions} questions.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSubmitConfirm(false);
                    submitTest();
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
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
