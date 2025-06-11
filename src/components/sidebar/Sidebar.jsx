import React from "react"
import {
  LayoutDashboard,
  CheckSquare,
  User,
  Menu,
  X,
} from "lucide-react"

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tests", label: "Tests", icon: CheckSquare },
  { id: "user", label: "User", icon: User },
]

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } bg-white/90 backdrop-blur-sm shadow-2xl border-r border-white/20 transition-all duration-300 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Test Management</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-gray-100 hover:scale-105"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-600"}`} />
                {sidebarOpen && (
                  <span className={`font-medium ${isActive ? "text-white" : "text-gray-700"}`}>{item.label}</span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 