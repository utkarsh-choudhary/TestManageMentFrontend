import { useState, useEffect } from "react"
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  FileText,
  Code,
  HelpCircle,
  Eye,
} from "lucide-react"

import {getAllTestsAssigned} from "../../api/test";

export default function TestDashboard() {
  const [assignments, setAssignments] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)
  const [activeTab, setActiveTab] = useState("all")


async function  handleGetAssignment(){
     try{

        const response=await getAllTestsAssigned();

        if(response.status===200){
            setAssignments(response.data.assignments);
        }

     }catch(error){
         
     }
}

  // Mock data based on your backend response
  useEffect(() => {
    // Replace this with your actual API call
       handleGetAssignment();
  }, [])

  // Categorize tests
  const completedTests = assignments.filter((test) => test.testCompleted === true)
  const pendingTests = assignments.filter((test) => test.status === "pending" && !test.testCompleted)
  const notTakenTests = assignments.filter((test) => test.status === "assigned" && !test.testCompleted)

  const getTestsByCategory = () => {
    switch (activeTab) {
      case "completed":
        return completedTests
      case "pending":
        return pendingTests
      case "not-taken":
        return notTakenTests
      default:
        return assignments
    }
  }

  const getQuestionIcon = (type) => {
    switch (type) {
      case "mcq":
        return <HelpCircle className="w-4 h-4 text-blue-500" />
      case "coding":
        return <Code className="w-4 h-4 text-green-500" />
      case "theory":
        return <FileText className="w-4 h-4 text-purple-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    if (percentage >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const TestCard = ({ test }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.template.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{test.template.position}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {test.template.testDuration} min
            </span>
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              {test.template.questions.length} questions
            </span>
            <span className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              {test.template.maxScore} points
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              test.status==='completed'
                ? "bg-green-100 text-green-800"
                : test.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {test.status}
          </span>
          {test.testCompleted && (
            <span className={`text-lg font-bold ${getScoreColor(test.totalScore, test.template.maxScore)}`}>
              {test.totalScore}/{test.template.maxScore}
            </span>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {test.candidate.firstName} {test.candidate.lastName}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(test.createdAt)}
            </span>
          </div>
          <button
            onClick={() => setSelectedTest(test)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>
      </div>
    </div>
  )

  const TestDetailModal = ({ test, onClose }) => {
    if (!test) return null

    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{test.template.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>

          <div className="p-6">
            {/* Test Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Test Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium">{test.template.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{test.template.testDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-medium">{test.template.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Score:</span>
                    <span className="font-medium">{test.template.maxScore}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Candidate Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {test.candidate.firstName} {test.candidate.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{test.candidate.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{test.candidate.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Started: {formatDate(test.createdAt)}</span>
                  </div>
                  {test.testSubmissionDate && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Submitted: {formatDate(test.testSubmissionDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Score Summary */}
            {test.testCompleted && (
              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Score Summary</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg">Total Score:</span>
                  <span className={`text-2xl font-bold ${getScoreColor(test.totalScore, test.template.maxScore)}`}>
                    {test.totalScore}/{test.template.maxScore}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(test.totalScore / test.template.maxScore) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round((test.totalScore / test.template.maxScore) * 100)}% Score
                  </p>
                </div>
              </div>
            )}

            {/* Questions and Answers */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Questions & Answers</h3>
              <div className="space-y-4">
                {test.template.questions.map((question, index) => {
                  const candidateAnswer = test.candidateAnswers.find((answer) => answer.question === question._id)

                  return (
                    <div key={question._id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-2 flex-1">
                          {getQuestionIcon(question.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                Q{index + 1} • {question.type.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">({question.marks} points)</span>
                            </div>
                            <p className="text-gray-900 font-medium">{question.question}</p>
                          </div>
                        </div>
                        {test.testCompleted && candidateAnswer && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              candidateAnswer.scoreAwarded > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {candidateAnswer.scoreAwarded}/{question.marks}
                          </span>
                        )}
                      </div>

                      {/* MCQ Options */}
                      {question.type === "mcq" && question.options && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">Options:</p>
                          <div className="grid grid-cols-1 gap-1">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded text-sm border ${
                                  option === question.correctAnswer
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : candidateAnswer && option === candidateAnswer.answer
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-gray-50 text-gray-700 border border-gray-100"
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {option === question.correctAnswer && (
                                  <span className="ml-2 text-xs font-medium">(Correct)</span>
                                )}
                                {candidateAnswer &&
                                  option === candidateAnswer.answer &&
                                  option !== question.correctAnswer && (
                                    <span className="ml-2 text-xs font-medium">(Your Answer)</span>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expected Answer - Always show for theory and coding */}
                      {(question.type === "theory" || question.type === "coding") && (
                        <div className="mb-3 p-3 bg-green-50 rounded border border-green-200">
                          <p className="text-sm text-gray-600 mb-1">Expected Answer:</p>
                          <pre className="text-sm text-gray-900 whitespace-pre-wrap">{question.correctAnswer}</pre>
                        </div>
                      )}

                      {/* Candidate Answer */}
                      {test.testCompleted && candidateAnswer && (
                        <div className="p-3 bg-gray-50 rounded border border-gray-100">
                          <p className="text-sm text-gray-600 mb-1">Candidate Answer:</p>
                          <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                            {candidateAnswer.answer || "No answer provided"}
                          </pre>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Test Dashboard</h1>
          <p className="text-gray-600 mt-1">View and manage all test assignments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTests.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Not Taken</p>
                <p className="text-2xl font-bold text-red-600">{notTakenTests.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "all", label: "All Tests", count: assignments.length },
                { key: "completed", label: "Completed", count: completedTests.length },
                { key: "pending", label: "Pending", count: pendingTests.length },
                { key: "not-taken", label: "Not Taken", count: notTakenTests.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {getTestsByCategory().map((test) => (
            <TestCard key={test._id} test={test} />
          ))}
        </div>

        {/* Empty State */}
        {getTestsByCategory().length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
            <p className="text-gray-600">No tests match the current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Test Detail Modal */}
      {selectedTest && <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)} />}
    </div>
  )
}
