import { useState } from "react"
import { X, Plus, FileText, Code, CheckCircle, Clock, Briefcase, Save, Edit3, Eye, Trash2, Edit } from "lucide-react"
import { createTest } from "../../api/test"

export default function TestCreationForm() {
  const [testData, setTestData] = useState({
    name: "",
    position: "",
    testDuration: 60, // in minutes
    questions: [],
  })

  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [showQuestionInputModal, setShowQuestionInputModal] = useState(false)
  const [selectedQuestionType, setSelectedQuestionType] = useState()
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null)

  const [currentQuestion, setCurrentQuestion] = useState({
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    mark: 0,
    correctAnswer: "",
  })

  const isBasicInfoComplete = testData.name && testData.position && testData.testDuration > 0
  const canSaveTest = testData.questions.length >= 3

  const handleBasicInfoChange = (field, value) => {
    setTestData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateQuestionClick = () => {
    if (isBasicInfoComplete) {
      setEditingQuestionIndex(null)
      setShowQuestionModal(true)
    }
  }

  const handleEditQuestion = (index) => {
    const question = testData.questions[index]
    setCurrentQuestion(question)
    setSelectedQuestionType(question.type)
    setEditingQuestionIndex(index)
    setShowQuestionInputModal(true)
  }

  const handleDeleteQuestion = (index) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setTestData((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }))
    }
  }

  const handleQuestionTypeSelect = (type) => {
    setSelectedQuestionType(type)
    if (editingQuestionIndex === null) {
      setCurrentQuestion({
        type,
        question: "",
        options: type === "mcq" ? ["", "", "", ""] : undefined,
        mark: 0,
        correctAnswer: "",
      })
    }
    setShowTypeModal(false)
    setShowQuestionInputModal(true)
  }

  const handleQuestionInputChange = (field, value) => {
    setCurrentQuestion((prev) => ({ ...prev, [field]: value }))
  }

  const handleOptionChange = (index, value) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options]
      newOptions[index] = value
      setCurrentQuestion((prev) => ({ ...prev, options: newOptions }))
    }
  }

  const saveQuestion = () => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      setTestData((prev) => ({
        ...prev,
        questions: prev.questions.map((q, index) => (index === editingQuestionIndex ? currentQuestion : q)),
      }))
    } else {
      // Add new question
      setTestData((prev) => ({
        ...prev,
        questions: [...prev.questions, currentQuestion],
      }))
    }

    setShowQuestionInputModal(false)
    setShowQuestionModal(false)
    setEditingQuestionIndex(null)
    setCurrentQuestion({
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      mark: 0,
      correctAnswer: "",
    })
  }

  const handleSaveTest = async () => {
    if (canSaveTest) {
      // Format data as requested: { name, position, questions, testDuration }
      const formattedTestData = {
        name: testData.name,
        position: testData.position,
        questions: testData.questions,
        testDuration: testData.testDuration,
      }

      console.log("Test Data:", JSON.stringify(formattedTestData, null, 2))

      const response = await createTest(formattedTestData)

      if (response.status === 201) {
        alert("Test created and saved successfully!")
        setTestData({
          name: "",
          position: "",
          testDuration: 60,
          questions: [],
        })
      } else {
        console.log(response)
        alert("Something went wrong")
      }
    }
  }

  const closeAllModals = () => {
    setShowQuestionModal(false)
    setShowTypeModal(false)
    setShowQuestionInputModal(false)
    setEditingQuestionIndex(null)
  }

  const getTotalMarks = () => {
    return testData.questions.reduce((total, question) => total + question.mark, 0)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleSaveTest}
          disabled={!canSaveTest}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            canSaveTest
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Save size={16} />
          <span>Publish Test</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Test Configuration</h2>
              <p className="text-sm text-gray-500 mt-1">Configure basic test settings and information</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <FileText size={16} className="text-gray-400" />
                    <span>Test Name</span>
                  </label>
                  <input
                    type="text"
                    value={testData.name}
                    onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter test name (e.g., React Developer Assessment)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Briefcase size={16} className="text-gray-400" />
                    <span>Position</span>
                  </label>
                  <input
                    type="text"
                    value={testData.position}
                    onChange={(e) => handleBasicInfoChange("position", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="e.g., Senior React Developer"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>Test Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    value={testData.testDuration}
                    onChange={(e) => handleBasicInfoChange("testDuration",Math.min( Number.parseInt(e.target.value)||0,90 ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter duration in minutes"
                    min="30"
                    max="90"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Questions Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Question Bank</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage test questions and their configurations</p>
                </div>
                <button
                  onClick={handleCreateQuestionClick}
                  disabled={!isBasicInfoComplete}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isBasicInfoComplete
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Plus size={16} />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {testData.questions.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">No questions added</h3>
                <p className="mt-2 text-sm text-gray-500">Get started by adding your first question to the test.</p>
                {!isBasicInfoComplete && (
                  <p className="mt-2 text-xs text-amber-600">Complete test configuration first to add questions.</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {testData.questions.map((question, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {question.type === "mcq" && (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle size={16} className="text-green-600" />
                            </div>
                          )}
                          {question.type === "coding" && (
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Code size={16} className="text-purple-600" />
                            </div>
                          )}
                          {question.type === "theory" && (
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Edit3 size={16} className="text-orange-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Question {index + 1} • {question.type}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {question.mark} pts
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600" title="Preview">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditQuestion(index)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Question:</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{question.question}</p>
                      </div>

                      {question.type === "mcq" && question.options && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Answer Options:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`text-sm p-2 rounded border ${
                                  option === question.correctAnswer
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                              >
                                <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                                {option === question.correctAnswer && (
                                  <span className="ml-2 text-green-600 text-xs">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(question.type === "theory" || question.type === "coding") && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Answer:</h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            {question.type === "coding" ? (
                              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
                                {question.correctAnswer}
                              </pre>
                            ) : (
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.correctAnswer}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Test Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Test Summary</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Test Duration:</span>
                <span className="font-medium text-gray-900">{testData.testDuration} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Questions:</span>
                <span className="font-medium text-gray-900">{testData.questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Marks:</span>
                <span className="font-medium text-gray-900">{getTotalMarks()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">MCQ Questions:</span>
                <span className="font-medium text-gray-900">
                  {testData.questions.filter((q) => q.type === "mcq").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Theory Questions:</span>
                <span className="font-medium text-gray-900">
                  {testData.questions.filter((q) => q.type === "theory").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Coding Questions:</span>
                <span className="font-medium text-gray-900">
                  {testData.questions.filter((q) => q.type === "coding").length}
                </span>
              </div>
            </div>
          </div>

          {/* Publishing Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Publishing Status</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isBasicInfoComplete ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className="text-sm text-gray-700">Test Configuration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${testData.questions.length >= 3 ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span className="text-sm text-gray-700">Minimum 3 Questions</span>
                </div>
              </div>
              {!canSaveTest && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-xs text-amber-800">
                    {!isBasicInfoComplete && "Complete test configuration. "}
                    {testData.questions.length < 3 && `Add ${3 - testData.questions.length} more question(s).`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Question</h3>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Select the type of question you want to add to this test.</p>
            <button
              onClick={() => setShowTypeModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all"
            >
              Choose Question Type
            </button>
          </div>
        </div>
      )}

      {showTypeModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Question Type</h3>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleQuestionTypeSelect("mcq")}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                <CheckCircle className="text-green-600" size={24} />
                <div className="text-left">
                  <div className="font-medium">Multiple Choice</div>
                  <div className="text-sm text-gray-600">Question with multiple options</div>
                </div>
              </button>

              <button
                onClick={() => handleQuestionTypeSelect("coding")}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Code className="text-purple-600" size={24} />
                <div className="text-left">
                  <div className="font-medium">Coding Challenge</div>
                  <div className="text-sm text-gray-600">Programming problem</div>
                </div>
              </button>

              <button
                onClick={() => handleQuestionTypeSelect("theory")}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Edit3 className="text-orange-600" size={24} />
                <div className="text-left">
                  <div className="font-medium">Theory Question</div>
                  <div className="text-sm text-gray-600">Descriptive answer</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuestionInputModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {selectedQuestionType === "mcq" && <CheckCircle className="text-green-600" />}
                {selectedQuestionType === "coding" && <Code className="text-purple-600" />}
                {selectedQuestionType === "theory" && <Edit3 className="text-orange-600" />}
                {editingQuestionIndex !== null ? "Edit" : "Create"} {selectedQuestionType?.toUpperCase()} Question
              </h3>
              <button onClick={closeAllModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => handleQuestionInputChange("question", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter your question here..."
                />
              </div>

              {selectedQuestionType === "mcq" && currentQuestion.options && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                  type="number"
                  value={currentQuestion.mark}
                  onChange={(e) => handleQuestionInputChange("mark", Number.parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter points for this question"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedQuestionType === "mcq" ? "Correct Answer" : "Expected Answer"}
                </label>
                <textarea
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => handleQuestionInputChange("correctAnswer", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={selectedQuestionType === "coding" ? 6 : 3}
                  placeholder={
                    selectedQuestionType === "mcq"
                      ? "Enter the exact text of the correct option"
                      : selectedQuestionType === "coding"
                        ? "Enter the expected code solution"
                        : "Enter the expected answer"
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveQuestion}
                  disabled={!currentQuestion.question || !currentQuestion.correctAnswer || currentQuestion.mark === 0}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-all"
                >
                  {editingQuestionIndex !== null ? "Update" : "Add"} Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
