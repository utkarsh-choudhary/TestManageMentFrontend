import { useState, useEffect } from "react"
import {
  X,
  Search,
  FileText,
  Code,
  CheckCircle,
  Mail,
  Phone,
  Briefcase,
  Clock,
  Eye,
  Send,
  Edit3,
  Target,
  Users,
  AlertCircle,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { assignTests, getAllTests } from "../../api/test"
import { getAllUsers } from "../../api/user"

// Custom Toast Components
const SuccessToast = ({ message, testName, userName }) => (
  <div className="flex items-start space-x-3">
 
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900">Assignment Successful!</p>
      <p className="text-sm text-gray-600 mt-1">
        Test <span className="font-medium text-gray-900">"{testName}"</span> has been assigned to{" "}
        <span className="font-medium text-gray-900">{userName}</span>
      </p>
    </div>
  </div>
)

const ErrorToast = ({ message }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0">
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-red-600" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900">Assignment Failed</p>
      <p className="text-sm text-gray-600 mt-1">{message}</p>
    </div>
  </div>
)

export default function TestAssignmentForm() {
  const [tests, setTests] = useState([])
  const [users, setUsers] = useState([])
  const [filteredTests, setFilteredTests] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [testSearchTerm, setTestSearchTerm] = useState("")
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [loading, setLoading] = useState({ tests: true, users: true, assigning: false })
  const [showTestDetails, setShowTestDetails] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)

  // Filter tests based on search term
  useEffect(() => {
    if (testSearchTerm.trim() === "") {
      setFilteredTests(tests)
    } else {
      const filtered = tests.filter(
        (test) =>
          test.name.toLowerCase().includes(testSearchTerm.toLowerCase()) ||
          test.position.toLowerCase().includes(testSearchTerm.toLowerCase()),
      )
      setFilteredTests(filtered)
    }
  }, [testSearchTerm, tests])

  // Filter users based on search term
  useEffect(() => {
    if (userSearchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        const searchTerm = userSearchTerm.toLowerCase()
        return (
          fullName.includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.phone && user.phone.includes(searchTerm))
        )
      })
      setFilteredUsers(filtered)
    }
  }, [userSearchTerm, users])

  async function handleGetAssignTest() {
    try {
      const response = await getAllTests()

      if (response.status === 200) {
        const templates = response.data.templates
        setTests(templates)
        setFilteredTests(templates)
        setLoading((prev) => ({ ...prev, tests: false }))
      } else {
        toast.error(<ErrorToast message="Failed to load tests. Please try again." />)
        setLoading((prev) => ({ ...prev, tests: false }))
      }
    } catch (error) {
      console.error("Error loading tests:", error)
      toast.error(<ErrorToast message="Failed to load tests. Please check your connection." />)
      setLoading((prev) => ({ ...prev, tests: false }))
    }
  }

  async function handleGetUser() {
    try {
      const response = await getAllUsers()

      if (response.status === 200) {
        setUsers(response.data)
        setFilteredUsers(response.data)
        setLoading((prev) => ({ ...prev, users: false }))
      } else {
        toast.error(<ErrorToast message="Failed to load users. Please try again." />)
        setLoading((prev) => ({ ...prev, users: false }))
      }
    } catch (error) {
      console.error("Error loading users:", error)
      toast.error(<ErrorToast message="Failed to load users. Please check your connection." />)
      setLoading((prev) => ({ ...prev, users: false }))
    }
  }

  useEffect(() => {
    handleGetUser()
    handleGetAssignTest()
  }, [])

  const handleTestSelect = (test) => {
    setSelectedTest(test)
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  const closeAllModals = () => {
    setShowTestDetails(false)
    setShowUserDetails(false)
    setShowAssignModal(false)
  }

  async function handleAssignTest() {
    if (!selectedTest || !selectedUser) {
      toast.error(<ErrorToast message="Please select both a test and a user before proceeding." />)
      return
    }

    try {
      setLoading((prev) => ({ ...prev, assigning: true }))

      const response = await assignTests({
        testId: selectedTest._id,
        userId: selectedUser._id,
      })

      if (response.status === 201) {
        toast.success(
          <SuccessToast
            message="Test assigned successfully!"
            testName={selectedTest.name}
            userName={getUserFullName(selectedUser)}
          />,
        )
        setShowAssignModal(false)
        setSelectedTest(null)
        setSelectedUser(null)
      } else {
        toast.error(<ErrorToast message={"This test has already been assigned to the selected user. Please choose a different test or user."} />)
      }
    } catch (error) {
      console.error("Error assigning test:", error)
      toast.error(<ErrorToast message={error.message || "An unexpected error occurred. Please try again."} />)
    } finally {
      setLoading((prev) => ({ ...prev, assigning: false }))
    }
  }

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case "mcq":
        return <CheckCircle size={16} className="text-green-600" />
      case "coding":
        return <Code size={16} className="text-purple-600" />
      case "theory":
        return <Edit3 size={16} className="text-orange-600" />
      default:
        return <FileText size={16} className="text-gray-600" />
    }
  }

  const getQuestionTypeCounts = (questions) => {
    return {
      mcq: questions.filter((q) => q.type === "mcq").length,
      theory: questions.filter((q) => q.type === "theory").length,
      coding: questions.filter((q) => q.type === "coding").length,
    }
  }

  const getUserFullName = (user) => {
    return `${user.firstName} ${user.lastName}`.trim()
  }

  const getUserStatus = (user) => {
    return user.isActive !== undefined ? (user.isActive ? "Active" : "Inactive") : "Unknown"
  }

  const canAssignTest = selectedTest && selectedUser

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assign Test to User</h1>
        <p className="text-gray-600">Select a test and a user to create an assignment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tests Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Tests</h2>
              <p className="text-sm text-gray-500 mt-1">Search and select a test to assign</p>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={testSearchTerm}
                  onChange={(e) => setTestSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search tests by name or position..."
                />
              </div>

              {loading.tests ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading tests...</p>
                </div>
              ) : filteredTests.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tests found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {testSearchTerm ? "Try adjusting your search terms" : "No tests available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredTests.map((test) => {
                    const questionCounts = getQuestionTypeCounts(test.questions || [])
                    const isSelected = selectedTest?._id === test._id

                    return (
                      <div
                        key={test._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleTestSelect(test)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">{test.name}</h3>
                              {isSelected && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Selected
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                              <div className="flex items-center space-x-1">
                                <Briefcase size={10} />
                                <span>{test.position}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock size={10} />
                                <span>{test.testDuration} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target size={10} />
                                <span>{test.maxScore} pts</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 text-xs">
                              <span className="text-green-600">{questionCounts.mcq} MCQ</span>
                              <span className="text-orange-600">{questionCounts.theory} Theory</span>
                              <span className="text-purple-600">{questionCounts.coding} Coding</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTest(test)
                              setShowTestDetails(true)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Users Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Users</h2>
              <p className="text-sm text-gray-500 mt-1">Search and select a user to assign the test</p>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search users by name, email, or phone..."
                />
              </div>

              {loading.users ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {userSearchTerm ? "Try adjusting your search terms" : "No users available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUser?._id === user._id
                    const fullName = getUserFullName(user)
                    const status = getUserStatus(user)

                    return (
                      <div
                        key={user._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "bg-green-50 border-green-500 ring-1 ring-green-500"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">{fullName}</h3>
                              {isSelected && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Selected
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                  user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {status}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 text-xs text-gray-500 mb-1">
                              <div className="flex items-center space-x-1">
                                <Mail size={10} />
                                <span>{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone size={10} />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <span className="capitalize">{user.role.toLowerCase()}</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUser(user)
                              setShowUserDetails(true)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Test Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Selected Test</h3>
            </div>
            <div className="p-4">
              {selectedTest ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{selectedTest.name}</p>
                    <p className="text-xs text-gray-500">{selectedTest.position}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-900">{selectedTest.testDuration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Questions:</span>
                    <span className="font-medium text-gray-900">{selectedTest.questions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Max Score:</span>
                    <span className="font-medium text-gray-900">{selectedTest.maxScore}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a test from the list above</p>
              )}
            </div>
          </div>

          {/* Selected User Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Selected User</h3>
            </div>
            <div className="p-4">
              {selectedUser ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{getUserFullName(selectedUser)}</p>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium text-gray-900">{selectedUser.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium text-gray-900 capitalize">{selectedUser.role.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${selectedUser.isActive ? "text-green-600" : "text-red-600"}`}>
                      {getUserStatus(selectedUser)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a user from the list above</p>
              )}
            </div>
          </div>

          {/* Assignment Action */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Assignment</h3>
            </div>
            <div className="p-4">
              <button
                onClick={() => setShowAssignModal(true)}
                disabled={!canAssignTest || loading.assigning}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  canAssignTest && !loading.assigning
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading.assigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Assign Test</span>
                  </>
                )}
              </button>

              {!canAssignTest && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  {!selectedTest && !selectedUser && "Select both a test and a user"}
                  {!selectedTest && selectedUser && "Select a test"}
                  {selectedTest && !selectedUser && "Select a user"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test Details Modal */}
      {showTestDetails && selectedTest && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Test Details: {selectedTest.name}</h3>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">Position</div>
                <div className="font-medium">{selectedTest.position}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">Duration</div>
                <div className="font-medium">{selectedTest.testDuration} minutes</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-500">Max Score</div>
                <div className="font-medium">{selectedTest.maxScore} points</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Questions ({selectedTest.questions?.length || 0})</h4>
              {selectedTest.questions?.map((question, index) => (
                <div key={question._id} className="border border-gray-200 rounded p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {getQuestionTypeIcon(question.type)}
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">
                      {question.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{question.question}</p>
                  {question.options && (
                    <div className="ml-4 space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="text-xs text-gray-600">
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Full Name</div>
                    <div className="font-medium">{getUserFullName(selectedUser)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Phone</div>
                      <div className="font-medium">{selectedUser.phone}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Role</div>
                    <div className="font-medium capitalize">{selectedUser.role.toLowerCase()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className={`font-medium ${selectedUser.isActive ? "text-green-600" : "text-red-600"}`}>
                      {getUserStatus(selectedUser)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Created At</div>
                    <div className="font-medium text-xs">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Confirmation Modal */}
      {showAssignModal && selectedTest && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Test Assignment</h3>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-900 mb-2">Test Details</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Name:</strong> {selectedTest.name}
                  </div>
                  <div>
                    <strong>Position:</strong> {selectedTest.position}
                  </div>
                  <div>
                    <strong>Duration:</strong> {selectedTest.testDuration} minutes
                  </div>
                  <div>
                    <strong>Questions:</strong> {selectedTest.questions?.length || 0}
                  </div>
                  <div>
                    <strong>Max Score:</strong> {selectedTest.maxScore}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-900 mb-2">User Details</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Name:</strong> {getUserFullName(selectedUser)}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <strong>Phone:</strong> {selectedUser.phone}
                    </div>
                  )}
                  <div>
                    <strong>Role:</strong> {selectedUser.role}
                  </div>
                  <div>
                    <strong>Status:</strong> {getUserStatus(selectedUser)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTest}
                  disabled={loading.assigning}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.assigning ? "Assigning..." : "Assign Test"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container with Custom Styling */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-progress-bar"
      />

      <style jsx global>{`
        .custom-toast-container {
          width: 420px;
        }
        
        .custom-toast {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #e5e7eb;
          padding: 16px;
          margin-bottom: 8px;
        }
        
        .custom-toast-body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .custom-progress-bar {
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          height: 3px;
        }
        
        .Toastify__toast--success .custom-progress-bar {
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
        }
        
        .Toastify__toast--error .custom-progress-bar {
          background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
        }
        
        .Toastify__close-button {
          color: #6b7280;
          opacity: 0.7;
        }
        
        .Toastify__close-button:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
