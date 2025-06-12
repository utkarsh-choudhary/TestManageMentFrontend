import { useState } from "react"
import { Eye, Calendar, Users, Clock, BarChart3, Search, Filter } from "lucide-react"

// Mock data for tests
const mockTests = [
  {
    id: 1,
    candidateName: "John Doe",
    position: "React Developer",
    email: "john@example.com",
    createdDate: "2024-01-15",
    status: "completed",
    score: 85,
    totalMarks: 100,
    duration: "45 min",
    questionsAnswered: 10,
    totalQuestions: 10,
  },
  {
    id: 2,
    candidateName: "Jane Smith",
    position: "Full Stack Developer",
    email: "jane@example.com",
    createdDate: "2024-01-14",
    status: "in-progress",
    score: 0,
    totalMarks: 120,
    duration: "30 min",
    questionsAnswered: 6,
    totalQuestions: 12,
  },
  {
    id: 3,
    candidateName: "Mike Johnson",
    position: "Frontend Developer",
    email: "mike@example.com",
    createdDate: "2024-01-13",
    status: "not-started",
    score: 0,
    totalMarks: 80,
    duration: "0 min",
    questionsAnswered: 0,
    totalQuestions: 8,
  },
  {
    id: 4,
    candidateName: "Sarah Wilson",
    position: "React Developer",
    email: "sarah@example.com",
    createdDate: "2024-01-12",
    status: "completed",
    score: 92,
    totalMarks: 100,
    duration: "38 min",
    questionsAnswered: 10,
    totalQuestions: 10,
  },
  {
    id: 5,
    candidateName: "David Brown",
    position: "Backend Developer",
    email: "david@example.com",
    createdDate: "2024-01-11",
    status: "completed",
    score: 78,
    totalMarks: 90,
    duration: "52 min",
    questionsAnswered: 9,
    totalQuestions: 9,
  },
]

export default function AllTests() {
  const [tests, setTests] = useState(mockTests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTest, setSelectedTest] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "not-started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreBarColor = (score, totalMarks) => {
    const percentage = (score / totalMarks) * 100
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    if (percentage >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const handleViewDetails = (test) => {
    setSelectedTest(test)
    setShowDetailModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All Tests</h1>
        <p className="text-gray-600">Manage and monitor all test submissions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, position, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Test Results ({filteredTests.length})</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTests.map((test) => (
            <div key={test.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{test.candidateName}</h3>
                    <p className="text-sm text-gray-500">
                      {test.position} • {test.email}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}
                  >
                    {test.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => handleViewDetails(test)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-all"
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{test.createdDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{test.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>
                    {test.questionsAnswered}/{test.totalQuestions} questions
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BarChart3 size={16} />
                  <span>
                    {test.score}/{test.totalMarks} points
                  </span>
                </div>
              </div>

              {/* Score Bar */}
              {test.status === "completed" && (
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Score</span>
                    <span>{Math.round((test.score / test.totalMarks) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getScoreBarColor(test.score, test.totalMarks)}`}
                      style={{ width: `${(test.score / test.totalMarks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Test Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Candidate Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{selectedTest.candidateName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <p className="font-medium">{selectedTest.position}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedTest.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Test Date:</span>
                    <p className="font-medium">{selectedTest.createdDate}</p>
                  </div>
                </div>
              </div>

              {/* Test Performance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Test Performance</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p
                      className={`font-medium ${selectedTest.status === "completed" ? "text-green-600" : selectedTest.status === "in-progress" ? "text-yellow-600" : "text-gray-600"}`}
                    >
                      {selectedTest.status.replace("-", " ").toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium">{selectedTest.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Questions Answered:</span>
                    <p className="font-medium">
                      {selectedTest.questionsAnswered}/{selectedTest.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Score:</span>
                    <p className="font-medium">
                      {selectedTest.score}/{selectedTest.totalMarks} (
                      {Math.round((selectedTest.score / selectedTest.totalMarks) * 100)}%)
                    </p>
                  </div>
                </div>

                {selectedTest.status === "completed" && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Overall Performance</span>
                      <span>{Math.round((selectedTest.score / selectedTest.totalMarks) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getScoreBarColor(selectedTest.score, selectedTest.totalMarks)}`}
                        style={{ width: `${(selectedTest.score / selectedTest.totalMarks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
