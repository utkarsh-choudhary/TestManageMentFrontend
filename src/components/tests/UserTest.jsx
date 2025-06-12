

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, User, Mail, Phone, Briefcase, Flag, HelpCircle, CheckSquare, CodeIcon, FileText, AlertTriangle, XCircle, ExternalLink } from 'lucide-react'

import { getTest } from "../../api/test"

// Mock test data
const mockTest = {
  id: "test-123",
  title: "React Developer Assessment",
  duration: 45, // in minute
  totalQuestions: 10,
  instructions: [
    "Read each question carefully before answering.",
    "You have 45 minutes to complete this test.",
    "You can navigate between questions using the navigation panel.",
    "Your answers are automatically saved when you move to another question.",
    "You can flag questions to review later.",
    "Submit your test when you have completed all questions.",
  ],
  questions: [],
}

export default function CandidateTestPage() {
  const [test, setTest] = useState(mockTest)
  const [candidateInfo, setCandidateInfo] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flaggedQuestions, setFlaggedQuestions] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60) // in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  // Error states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTestExpired, setIsTestExpired] = useState(false)

  const param = useParams()
  const { id } = param

  // Timer functionality
  useEffect(() => {
    if (testStarted && !testSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeRemaining === 0 && !testSubmitted) {
      handleSubmitTest()
    }
  }, [testStarted, testSubmitted, timeRemaining])

  async function handleGetTest() {
    setIsLoading(true)
    setError(null)
    setIsTestExpired(false)

    try {
      const response = await getTest(id)

      if (response.status === 200) {
        console.log("success")

        // Check if test is expired
        if (response.data.test.isExpired) {
          setIsTestExpired(true)
          setIsLoading(false)
          return
        }

        setTest(response.data.test)

        // Initialize candidate info from test data
        if (response.data.test) {
          setCandidateInfo({
            name: response.data.test.name || "",
            email: response.data.test.email || "",
            phone: response.data.test.phone || "",
            position: response.data.test.position || "",
          })
        }
      } else {
        setError("Failed to load test. Please try again later.")
      }
    } catch (error) {
      console.error(error)
      setError("Something went wrong. Please try again later.")

      // Check if error is related to test expiration
      if (error.response && error.response.status === 410) {
        setIsTestExpired(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetTest()
  }, [id])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStartTest = () => {
    setTestStarted(true)
    setShowInstructions(false)
  }

  const handleCandidateInfoChange = (field, value) => {
    if (field === "name" || field === "phone") {
      setCandidateInfo((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      // Save current answer before moving to next question
      const currentQuestion = test.questions[currentQuestionIndex]
      
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer before moving to previous question
      const currentQuestion = test.questions[currentQuestionIndex]
      
      // Move to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleJumpToQuestion = (index) => {
    // Save current answer before jumping to another question
    const currentQuestion = test.questions[currentQuestionIndex]
    
    // Jump to selected question
    setCurrentQuestionIndex(index)
  }

  const handleSubmitTest = () => {
    if (confirmSubmit) {
      // Prepare final answers array with question IDs and answers
      const finalAnswers = Object.keys(answers).map(questionId => {
        const question = test.questions.find(q => q.id === questionId)
        return {
          questionId,
          answer: answers[questionId],
          type: question?.type
        }
      })

      // Here you would typically send the answers to your backend
      console.log("Test submitted:", {
        candidateInfo,
        answers: finalAnswers
      })
      setTestSubmitted(true)
    } else {
      setConfirmSubmit(true)
    }
  }

  const getQuestionStatus = (index) => {
    const questionId = test.questions[index].id
    if (flaggedQuestions.includes(questionId)) return "flagged"
    if (answers[questionId]) return "answered"
    return "unanswered"
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white"
      case "flagged":
        return "bg-yellow-500 text-white"
      case "unanswered":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  const renderQuestion = () => {
    if (!test.questions || test.questions.length === 0 || !test.questions[currentQuestionIndex]) {
      return <div className="text-center py-8 text-gray-500">No questions available</div>
    }

    const question = test.questions[currentQuestionIndex]
    const answer = answers[question.id] || ""

    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900">{question.question}</div>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`question-${question.id}`}
                    value={option}
                    checked={answer === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`option-${index}`} className="ml-3 block text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      case "theory":
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900">{question.question}</div>
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={8}
              placeholder="Type your answer here..."
            />
          </div>
        )
      case "coding":
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900">{question.question}</div>
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              rows={12}
              placeholder="// Write your code here..."
            />
          </div>
        )
      default:
        return <div>Unknown question type</div>
    }
  }

  const renderQuestionIcon = (type) => {
    switch (type) {
      case "mcq":
        return <CheckSquare size={16} className="text-green-600" />
      case "theory":
        return <FileText size={16} className="text-orange-600" />
      case "coding":
        return <CodeIcon size={16} className="text-purple-600" />
      default:
        return <HelpCircle size={16} className="text-gray-600" />
    }
  }

  // Error state - Test expired
  if (isTestExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle size={64} className="mx-auto text-red-500 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Has Expired</h1>
          <p className="text-gray-600 mb-6">
            This test is no longer available. The test link has expired or the test has been closed by the
            administrator.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:support@example.com?subject=Test%20Expired%20-%20Request%20Assistance"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
            >
              <ExternalLink size={16} className="mr-2" />
              Contact Administrator
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Error state - General error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle size={64} className="mx-auto text-yellow-500 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleGetTest}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
            >
              Try Again
            </button>
            <a
              href="mailto:support@example.com?subject=Test%20Error%20-%20Request%20Assistance"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
            >
              <ExternalLink size={16} className="mr-2" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (testSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Submitted Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for completing the test. Your responses have been recorded.</p>
          <p className="text-sm text-gray-500">
            You will be notified about the results via email at {candidateInfo.email}
          </p>
        </div>
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h1 className="text-xl font-bold text-white text-center">{test.position}</h1>
            </div>

            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Candidate Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={candidateInfo.name}
                      onChange={(e) => handleCandidateInfoChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={candidateInfo.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={candidateInfo.phone}
                      onChange={(e) => handleCandidateInfoChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-400" />
                      <span>Position Applied</span>
                    </label>
                    <input
                      type="text"
                      value={candidateInfo.position}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Instructions</h2>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    {test.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-xl font-bold text-gray-900">{test.duration} min</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="text-xl font-bold text-gray-900">{test.totalQuestions}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Total Marks</p>
                    <p className="text-xl font-bold text-gray-900">
                      {test.questions && test.questions.length > 0
                        ? test.questions.reduce((total, q) => total + q.mark, 0)
                        : 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Question Types</p>
                    <p className="text-xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleStartTest}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if test has questions
  if (!test.questions || test.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle size={64} className="mx-auto text-yellow-500 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h1>
          <p className="text-gray-600 mb-6">
            This test doesn't have any questions yet. Please contact the administrator for assistance.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:support@example.com?subject=Test%20Questions%20Missing%20-%20Request%20Assistance"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
            >
              <ExternalLink size={16} className="mr-2" />
              Contact Administrator
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-bold text-gray-900">{test.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-gray-500" />
                <span
                  className={`font-mono font-medium ${
                    timeRemaining < 300 ? "text-red-600 animate-pulse" : "text-gray-700"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <button
                onClick={() => setConfirmSubmit(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question navigation sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Question Navigation</h2>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {test.questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleJumpToQuestion(index)}
                    className={`h-8 w-8 rounded-md flex items-center justify-center text-sm font-medium ${
                      currentQuestionIndex === index
                        ? "ring-2 ring-blue-500 bg-blue-50 text-blue-700"
                        : getStatusClass(getQuestionStatus(index))
                    }`}
                    title={`Question ${index + 1} (${question.type.toUpperCase()})`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">Flagged for review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                  <span className="text-gray-600">Unanswered</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {Object.keys(answers).length}/{test.questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(Object.keys(answers).length / test.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main question area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    {currentQuestionIndex + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    {renderQuestionIcon(test.questions[currentQuestionIndex].type)}
                    <span className="text-sm font-medium text-gray-600 uppercase">
                      {test.questions[currentQuestionIndex].type}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {test.questions[currentQuestionIndex].mark} marks
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleFlagQuestion(test.questions[currentQuestionIndex].id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm ${
                    flaggedQuestions.includes(test.questions[currentQuestionIndex].id)
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Flag size={14} />
                  <span>{flaggedQuestions.includes(test.questions[currentQuestionIndex].id) ? "Flagged" : "Flag"}</span>
                </button>
              </div>

              {renderQuestion()}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                    currentQuestionIndex === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === test.questions.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                    currentQuestionIndex === test.questions.length - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm submit modal */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center mb-6">
              <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Submit Test?</h3>
              <p className="text-gray-600 mt-2">
                You have answered {Object.keys(answers).length} out of {test.questions.length} questions. Are you sure
                you want to submit your test?
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmSubmit(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
