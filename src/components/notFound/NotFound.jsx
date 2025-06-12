
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Home, ArrowLeft, Search, FileQuestion, RefreshCw } from "lucide-react"

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative">
            <FileQuestion size={120} className="mx-auto text-gray-300 mb-4" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <AlertTriangle size={40} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What you can do:</h3>
          <ul className="text-left space-y-3 text-gray-600">
            <li className="flex items-center space-x-3">
              <Search size={16} className="text-blue-500 flex-shrink-0" />
              <span>Check the URL for any typos</span>
            </li>
            <li className="flex items-center space-x-3">
              <RefreshCw size={16} className="text-green-500 flex-shrink-0" />
              <span>Refresh the page</span>
            </li>
            <li className="flex items-center space-x-3">
              <Home size={16} className="text-purple-500 flex-shrink-0" />
              <span>Go back to the homepage</span>
            </li>
            <li className="flex items-center space-x-3">
              <ArrowLeft size={16} className="text-orange-500 flex-shrink-0" />
              <span>Return to the previous page</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex-1"
            >
              <Home size={18} />
              <span>Go to Homepage</span>
            </button>
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all flex-1"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all w-full"
          >
            <RefreshCw size={16} />
            <span>Refresh Page</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Still having trouble? Contact our support team.</p>
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <span>support@example.com</span>
          </a>
        </div>

        {/* Error Code */}
        <div className="mt-6">
          <p className="text-xs text-gray-400">Error Code: 404 | Page Not Found</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
