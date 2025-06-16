import { useEffect, useState } from "react"
import {getAllTests} from "../../api/test"
import {
  Eye,
  Calendar,
  Users,
  Clock,
  BarChart3,
  Search,
  X,
  CheckCircle,
  Code,
  Edit3,
  FileText,
  Target,
} from "lucide-react"

// Update the dummy data to match your API response
const dummyTemplates = [
  {
    _id: "684c12f91b8e3005bae574df",
    name: "JUNIOR REACT JS DEVELOPER",
    position: "React js developer",
    questions: [
      {
        _id: "684c12f81b8e3005bae574c7",
        type: "mcq",
        question: "What is React primarily used for?",
        options: ["Building mobile apps", "Server-side processing", "Building user interfaces", "Data analysis"],
      },
      {
        _id: "684c12f81b8e3005bae574c8",
        type: "mcq",
        question: "Which feature of React allows it to efficiently update the UI?",
        options: ["Real DOM", "Virtual DOM", "Shadow DOM", "Document Fragment"],
      },
      // ... other questions
    ],
    maxScore: 68,
    testDuration: 40,
    createdBy: "684ab4abd64a80ab7e81a15a",
    createdAt: "2025-06-13T12:00:57.190Z",
    __v: 0,
  },
  {
    _id: "684d595cd1bf925132158e50",
    name: "gerer",
    position: "ger",
    questions: [
      {
        _id: "684d595bd1bf925132158e4a",
        type: "coding",
        question: "dfsds",
      },
      {
        _id: "684d595bd1bf925132158e4b",
        type: "coding",
        question: "fessdfsd",
      },
      {
        _id: "684d595bd1bf925132158e4c",
        type: "coding",
        question: "efwffewwe",
      },
    ],
    maxScore: 0,
    testDuration: 60,
    createdBy: "684ab4abd64a80ab7e81a15a",
    createdAt: "2025-06-14T11:13:32.055Z",
    __v: 0,
  },
  {
    _id: "684fc53109bcfbfd935c008f",
    name: "FIRST ROUND",
    position: "React js developer",
    questions: [
      {
        _id: "684fc53109bcfbfd935c0089",
        type: "coding",
        question: "iefwiuwefih",
      },
      {
        _id: "684fc53109bcfbfd935c008a",
        type: "coding",
        question: "efwfijewfewbhewfbuh",
      },
      {
        _id: "684fc53109bcfbfd935c008b",
        type: "coding",
        question: "fvefwefwhufewih",
      },
    ],
    maxScore: 0,
    testDuration: 90,
    createdBy: "684ab4abd64a80ab7e81a15a",
    createdAt: "2025-06-16T07:18:09.907Z",
    __v: 0,
  },
]

// Update state and component logic
export default function AllTests() {
  const [templates, setTemplates] = useState(dummyTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.position.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleViewDetails = (template) => {
    setSelectedTemplate(template)
    setShowDetailModal(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }



  const handleGetTestTemplates=async()=>{
      try{

        const response=await getAllTests();

        if(response.status===200){
          setTemplates(response.data.templates);
        
        }

      }catch(error){
        console.log("ERROR",error.message);

      }finally{
           setLoading(false);
      }

  }
  useEffect(() => {

    handleGetTestTemplates();
  }, [])

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
    const counts = { mcq: 0, theory: 0, coding: 0 }
    questions.forEach((question) => {
      counts[question.type]++
    })
    return counts
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Templates</h1>
        <p className="text-gray-600">Manage and review all available test templates</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by test name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Templates ({filteredTemplates.length})</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading templates...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTemplates.map((template) => {
              const questionCounts = getQuestionTypeCounts(template.questions || [])

              return (
                <div key={template._id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.position}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(template)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-all"
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{formatDate(template.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{template.testDuration} min</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{template.questions.length} questions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BarChart3 size={16} />
                      <span>{template.maxScore} points</span>
                    </div>
                  </div>

                  {/* Question Type Breakdown */}
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-600 font-medium">{questionCounts.mcq} MCQ</span>
                    <span className="text-orange-600 font-medium">{questionCounts.theory} Theory</span>
                    <span className="text-purple-600 font-medium">{questionCounts.coding} Coding</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTemplate && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Test Template Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Template Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Template Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Test Name:</span>
                    <p className="font-medium">{selectedTemplate.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <p className="font-medium">{selectedTemplate.position}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium">{selectedTemplate.testDuration} minutes</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Questions:</span>
                    <p className="font-medium">{selectedTemplate.questions.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Max Score:</span>
                    <p className="font-medium">{selectedTemplate.maxScore} points</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">{formatDate(selectedTemplate.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Target size={16} className="mr-2" />
                  Questions ({selectedTemplate.questions.length})
                </h4>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTemplate.questions.map((question, index) => (
                    <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        {getQuestionTypeIcon(question.type)}
                        <span className="text-sm font-medium">Question {index + 1}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">
                          {question.type}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 font-medium">{question.question}</p>

                      {/* For MCQ questions - show options */}
                      {question.type === "mcq" && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="p-2 rounded text-sm bg-gray-50 border border-gray-200">
                              <span>
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
