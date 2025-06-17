import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  XCircle,
  Play,
  Timer,
  FileText,
  LogOut,
  Loader2,
} from "lucide-react"

import { getUserAllInfo, getUserProfile } from "../../api/test"

export default function UserDashboard() {
  const [tests, setTests] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userData, setUserData] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  async function handleGetUserData() {
    try {
      const response = await getUserAllInfo()
      if (response && response.data && response.data.assignments) {
        setTests(response.data.assignments)
      }
      console.log("User data response:", response)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  async function handleGetUserProfile() {
    try {
      const response = await getUserProfile()
      if (response.status === 200) {
        setUserData(response.data)
      }
    } catch (error) {
      console.log("Error fetching user profile:", error)
    }
  }

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    handleGetUserData()
    handleGetUserProfile()
  }, [])

  // Calculate time remaining for a test (3 days from creation)
  const calculateTimeRemaining = (createdAt) => {
    const created = new Date(createdAt)
    const deadline = new Date(created.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days
    const now = currentTime
    const timeLeft = deadline.getTime() - now.getTime()

    if (timeLeft <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0 }
    }

    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000))
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))

    return { expired: false, days, hours, minutes }
  }

  // Update test statuses based on time
  useEffect(() => {
    setTests((prevTests) => {
      return prevTests.map((test) => {
        if (test.status === "pending") {
          const timeRemaining = calculateTimeRemaining(test.createdAt)
          if (timeRemaining.expired) {
            return { ...test, status: "missed" }
          }
        }
        return test
      })
    })
  }, [currentTime])

  const handleTakeTest = (testId) => {
    navigate(`/test/${testId}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "missed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-blue-600" />
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />
      case "missed":
        return <XCircle size={16} className="text-red-600" />
      default:
        return <FileText size={16} className="text-gray-600" />
    }
  }

  const formatTimeRemaining = (timeRemaining) => {
    if (timeRemaining.expired) {
      return "Expired"
    }

    const parts = []
    if (timeRemaining.days > 0) parts.push(`${timeRemaining.days}d`)
    if (timeRemaining.hours > 0) parts.push(`${timeRemaining.hours}h`)
    if (timeRemaining.minutes > 0) parts.push(`${timeRemaining.minutes}m`)

    return parts.length > 0 ? parts.join(" ") : "Less than 1m"
  }

  const pendingTests = tests.filter(
    (test) => test.status === "pending" && !test.testCompleted && test.status !== "completed",
  )
  const completedTests = tests.filter((test) => test.testCompleted === true || test.status === "completed")
  const missedTests = tests.filter((test) => {
    const timeRemaining = calculateTimeRemaining(test.createdAt)
    return timeRemaining.expired && !test.testCompleted && test.status !== "completed"
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tests</h1>
              <p className="text-gray-600 mt-1">Manage your assigned tests and track your progress</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData ? `${userData.firstName} ${userData.lastName}` : "N/A"}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>

                {/* Logout Confirmation Dialog */}
                {showLogoutConfirm && (
                  <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to logout? You'll need to login again to access your tests.
                      </p>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowLogoutConfirm(false)
                            handleLogout()
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">
                  {userData ? `${userData.firstName} ${userData.lastName}` : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{userData?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{userData?.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                <p className="text-2xl font-bold text-blue-600">{pendingTests.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tests</p>
                <p className="text-2xl font-bold text-green-600">{completedTests.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Missed Tests</p>
                <p className="text-2xl font-bold text-red-600">{missedTests.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tests Section */}
        {pendingTests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock size={20} className="text-blue-600" />
              <span>Pending Tests</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingTests.map((test) => {
                const timeRemaining = calculateTimeRemaining(test.createdAt)
                return (
                  <div key={test._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.template.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{test.template.position}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <Briefcase size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{test.template.position}</span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}
                      >
                        {getStatusIcon(test.status)}
                        <span className="ml-1">{test.status.toUpperCase()}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Timer size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{test.template.testDuration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{test.template.questions.length} questions</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTakeTest(test._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Play size={14} className="mr-1" />
                        Take Test
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Time Remaining:</span>
                        <span className="font-medium text-blue-600">{formatTimeRemaining(timeRemaining)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Completed Tests Section */}
        {completedTests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-600" />
              <span>Completed Tests</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedTests.map((test) => (
                <div key={test._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{test.template.position}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{test.template.position}</span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor("completed")}`}
                    >
                      {getStatusIcon("completed")}
                      <span className="ml-1">COMPLETED</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Timer size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{test.template.testDuration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{test.template.questions.length} questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Completed on:</span>
                      
                      <span className="font-medium text-gray-900">{new Date(test.testSubmissionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tests.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Assigned</h3>
            <p className="text-gray-600">You don't have any tests assigned at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
