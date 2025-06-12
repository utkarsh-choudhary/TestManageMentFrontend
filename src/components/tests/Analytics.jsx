import { useState } from "react"
import { Users, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Calendar, BarChart3 } from "lucide-react"

// Mock analytics data
const analyticsData = {
  totalTests: 156,
  testsGiven: 142,
  shortlisted: 45,
  rejected: 67,
  notAttended: 14,
  disqualified: 16,
  averageScore: 73.5,
  passRate: 68.3,
  monthlyData: [
    { month: "Jan", tests: 25, passed: 18, failed: 7 },
    { month: "Feb", tests: 32, passed: 22, failed: 10 },
    { month: "Mar", tests: 28, passed: 19, failed: 9 },
    { month: "Apr", tests: 35, passed: 26, failed: 9 },
    { month: "May", tests: 36, passed: 25, failed: 11 },
  ],
  positionStats: [
    { position: "React Developer", total: 45, shortlisted: 18, rejected: 20, notAttended: 4, disqualified: 3 },
    { position: "Full Stack Developer", total: 38, shortlisted: 15, rejected: 16, notAttended: 4, disqualified: 3 },
    { position: "Frontend Developer", total: 32, shortlisted: 8, rejected: 18, notAttended: 3, disqualified: 3 },
    { position: "Backend Developer", total: 27, shortlisted: 4, rejected: 13, notAttended: 3, disqualified: 7 },
  ],
}

export default function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("last-30-days")

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  )

  const ProgressBar = ({ label, value, total, color }) => {
    const percentage = (value / total) * 100
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>
            {value} ({percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track test performance and candidate statistics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400" />
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="last-year">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tests Created"
          value={analyticsData.totalTests}
          icon={BarChart3}
          color="bg-blue-500"
          subtitle="All time"
        />
        <StatCard
          title="Tests Given"
          value={analyticsData.testsGiven}
          icon={Users}
          color="bg-green-500"
          subtitle={`${((analyticsData.testsGiven / analyticsData.totalTests) * 100).toFixed(1)}% completion rate`}
        />
        <StatCard
          title="Average Score"
          value={`${analyticsData.averageScore}%`}
          icon={TrendingUp}
          color="bg-purple-500"
          subtitle="Across all tests"
        />
        <StatCard
          title="Pass Rate"
          value={`${analyticsData.passRate}%`}
          icon={CheckCircle}
          color="bg-emerald-500"
          subtitle="Above 60% score"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Test Results Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Test Results Breakdown</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
                <p className="text-2xl font-bold text-green-600">{analyticsData.shortlisted}</p>
                <p className="text-sm text-gray-600">Shortlisted</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="mx-auto mb-2 text-red-600" size={32} />
                <p className="text-2xl font-bold text-red-600">{analyticsData.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="mx-auto mb-2 text-gray-600" size={32} />
                <p className="text-2xl font-bold text-gray-600">{analyticsData.notAttended}</p>
                <p className="text-sm text-gray-600">Not Attended</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="mx-auto mb-2 text-orange-600" size={32} />
                <p className="text-2xl font-bold text-orange-600">{analyticsData.disqualified}</p>
                <p className="text-sm text-gray-600">Disqualified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Test Trends</h3>
          <div className="space-y-4">
            {analyticsData.monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex space-x-1">
                    <div
                      className="bg-green-500 h-6 rounded"
                      style={{ width: `${(month.passed / month.tests) * 100}%` }}
                      title={`Passed: ${month.passed}`}
                    ></div>
                    <div
                      className="bg-red-500 h-6 rounded"
                      style={{ width: `${(month.failed / month.tests) * 100}%` }}
                      title={`Failed: ${month.failed}`}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">{month.tests} tests</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Passed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Failed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Position-wise Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Position-wise Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Position</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Total Tests</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Shortlisted</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Rejected</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Not Attended</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Disqualified</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.positionStats.map((position, index) => {
                const successRate = ((position.shortlisted / position.total) * 100).toFixed(1)
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{position.position}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{position.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {position.shortlisted}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {position.rejected}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {position.notAttended}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {position.disqualified}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${successRate}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{successRate}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
