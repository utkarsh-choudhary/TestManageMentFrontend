import { useState } from "react"
import { Settings } from "lucide-react"
import TestCreationForm from "./CreateTest.jsx"
import AllTests from "./AllTest.jsx"
import Analytics from "./Analytics.jsx"
import Assign from "./Assign.jsx"

export default function TestManagementDashboard() {
  const [activeTab, setActiveTab] = useState("create")

  const tabs = [
    { id: "create", label: "Create Test" },
    { id: "all-tests", label: "All Tests" },
    {id:"assign-test", label:"Assign Test" },
    { id: "analytics", label: "Analytics" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <TestCreationForm />
      case "all-tests":
        return <AllTests />
      case "analytics":
        return <Analytics />
      case "assign-test":
        return <Assign />
      default:
        return <TestCreationForm />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}
