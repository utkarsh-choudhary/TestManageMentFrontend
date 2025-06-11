import React, { useState, useEffect, useRef } from "react"
import { Search, Bell, Settings } from "lucide-react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import Sidebar from "../components/sidebar/Sidebar"
import DashboardContent from "../components/dashboard/DashboardContent"
import TestsContent from "../components/tests/TestsContent"
import UserContent from "../components/user/UserContent"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [floatingShapes, setFloatingShapes] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  const canvasRef = useRef(null)
  const animationRef = useRef()

  // Get current active tab from path
  const getActiveTab = () => {
    const path = location.pathname.split('/').pop()
    return path || 'dashboard'
  }

  // Handle navigation
  const handleNavigation = (tab) => {
    if (tab === 'dashboard') {
      navigate('/dashboard')
    } else {
      navigate(`/dashboard/${tab}`)
    }
  }

  // Initialize particles and shapes
  useEffect(() => {
    const newParticles = []
    const newShapes = []

    // Create particles
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981"][Math.floor(Math.random() * 4)],
      })
    }

    // Create floating shapes
    for (let i = 0; i < 8; i++) {
      newShapes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.3 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)],
        color: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"][Math.floor(Math.random() * 5)],
      })
    }

    setParticles(newParticles)
    setFloatingShapes(newShapes)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Mouse interaction
        const dx = mousePosition.x - particle.x
        const dy = mousePosition.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          particle.vx += dx * 0.00003
          particle.vy += dy * 0.00003
        }

        particle.x += particle.vx
        particle.y += particle.vy

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle) => {
          if (particle.id !== otherParticle.id) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 60) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = particle.color + "15"
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particles, mousePosition])

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-gray-50">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)" }}
      />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 z-10">
        {floatingShapes.map((shape) => (
          <div
            key={shape.id}
            className={`absolute animate-float-${shape.id % 3}`}
            style={{
              left: `${(shape.x / window.innerWidth) * 100}%`,
              top: `${(shape.y / window.innerHeight) * 100}%`,
              transform: `rotate(${shape.rotation}deg) scale(${shape.scale})`,
              animationDelay: `${shape.id * 0.5}s`,
              animationDuration: `${12 + shape.speed * 4}s`,
            }}
          >
            {shape.shape === "circle" && (
              <div className="w-6 h-6 rounded-full opacity-10 animate-pulse" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === "square" && (
              <div className="w-4 h-4 opacity-10 animate-spin-slow" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === "triangle" && (
              <div
                className="w-0 h-0 opacity-10"
                style={{
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: `12px solid ${shape.color}`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="relative z-30 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          activeTab={getActiveTab()} 
          setActiveTab={handleNavigation} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">{getActiveTab()}</h1>
                <p className="text-gray-600">
                  {getActiveTab() === "dashboard" && "Overview of your tests and activities"}
                  {getActiveTab() === "tests" && "Manage and organize your tests"}
                  {getActiveTab() === "user" && "Your profile and account settings"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/dashboard" element={<DashboardContent />} />
              <Route path="/tests" element={<TestsContent />} />
              <Route path="/user" element={<UserContent />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}
