import React from "react"
import { CheckSquare, BarChart3, Clock, Users } from "lucide-react"

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
        <p className="text-gray-600">Here's what's happening with your tests today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <CheckSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">18</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">4</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-3xl font-bold text-purple-600">8</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Test completed: "Design new dashboard"</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 