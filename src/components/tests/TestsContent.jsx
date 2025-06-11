import React from "react"
import { Plus } from "lucide-react"

export default function TestsContent() {
  return (
    <div className="space-y-6">
      {/* Tests Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tests</h2>
            <p className="text-gray-600">Manage and track your tests efficiently.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Tests</span>
          </button>
        </div>
      </div>

      {/* Task Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">To Do</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((task) => (
              <div key={task} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="font-medium text-gray-900">Test {task}</p>
                <p className="text-sm text-gray-600">Description for test {task}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">In Progress</h3>
          <div className="space-y-3">
            {[1, 2].map((task) => (
              <div
                key={task}
                className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
              >
                <p className="font-medium text-gray-900">Active test {task}</p>
                <p className="text-sm text-gray-600">Currently working on this</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((task) => (
              <div
                key={task}
                className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
              >
                <p className="font-medium text-gray-900">Done Task {task}</p>
                <p className="text-sm text-gray-600">Successfully completed</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 