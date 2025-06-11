import React from "react"
import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, User, Sparkles, Zap } from "lucide-react"
import { login } from "./api/user"
import { useNavigate } from "react-router-dom"



export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [focusedField, setFocusedField] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [floatingShapes, setFloatingShapes] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const canvasRef = useRef(null)
  const animationRef = useRef()
  const navigate = useNavigate()

  // Initialize particles and shapes
  useEffect(() => {
    const newParticles = []
    const newShapes = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981"][Math.floor(Math.random() * 4)],
      })
    }

    // Create floating shapes
    for (let i = 0; i < 15; i++) {
      newShapes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)],
        color: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"][Math.floor(Math.random() * 5)],
      })
    }

    setParticles(newParticles)
    setFloatingShapes(newShapes)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = () => {
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
          particle.vx += dx * 0.00005
          particle.vy += dy * 0.00005
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

            if (distance < 80) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = particle.color + "20"
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

  // Real-time email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(email))
  }, [email])

  // Real-time password validation
  useEffect(() => {
    setPasswordValid(password.length >= 6)
  }, [password])

  // Typing detection
  useEffect(() => {
    if (email || password) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)
    setShowSparkles(true)

    // Mark fields as touched
    setEmailTouched(true)
    setPasswordTouched(true)

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      setShowSparkles(false)
      return
    }

    if (!emailValid) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      setShowSparkles(false)
      return
    }

    if (!passwordValid) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      setShowSparkles(false)
      return
    }

    try {
      const response = await login({ email, password })
      console.log(("zzzzzzzzzzzzz", response))
      setSuccess("Login successful! Redirecting...")
      
      // Store any necessary data from response
      if (response.data) {
        // You might want to store the token or user data in localStorage/context
        localStorage.setItem('token', response.data.user.token)
      }

      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials and try again.")
      setShowSparkles(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldBorderClass = (field, isValid, isTouched) => {
    if (!isTouched) return "border-gray-300 focus:border-blue-500"
    if (isValid) return "border-green-500 focus:border-green-500"
    return "border-red-500 focus:border-red-500"
  }

  const getFieldRingClass = (field, isValid, isTouched) => {
    if (!isTouched) return "focus:ring-blue-500"
    if (isValid) return "focus:ring-green-500"
    return "focus:ring-red-500"
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
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
              animationDuration: `${8 + shape.speed * 4}s`,
            }}
          >
            {shape.shape === "circle" && (
              <div className="w-8 h-8 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === "square" && (
              <div className="w-6 h-6 opacity-20 animate-spin-slow" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === "triangle" && (
              <div
                className="w-0 h-0 opacity-20"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderBottom: `20px solid ${shape.color}`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 z-20" />

      {/* Main Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex-shrink-0">
          {/* Project Title with enhanced animation */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl animate-bounce-slow">
              <User className="w-10 h-10 text-white" />
              {showSparkles && (
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-0" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute bottom-0 left-0" />
                  <Zap className="w-5 h-5 text-yellow-400 absolute top-2 left-2" />
                </div>
              )}
            </div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-gradient-x">
              Test Management
            </h1>
            
            {isTyping && (
              <div className="mt-2 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-400"></div>
                </div>
              </div>
            )}
          </div>

          {/* Login Card with glass morphism */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up animation-delay-200 hover:bg-white/15 transition-all duration-500">
            {/* Card Header */}
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-3xl font-semibold text-center text-white mb-2">Welcome back</h2>
              <p className="text-center text-white/70">Sign in to your account to continue</p>
            </div>

            {/* Card Content */}
            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Alert */}
                {success && (
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 flex items-start space-x-3 animate-fade-in animate-pulse-success">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0 animate-spin-once" />
                    <p className="text-green-100 text-sm font-medium">{success}</p>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 flex items-start space-x-3 animate-shake-intense">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
                    <p className="text-red-100 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white/90">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail
                      className={`absolute left-4 top-4 h-5 w-5 transition-all duration-300 ${
                        focusedField === "email"
                          ? "text-blue-400 scale-110"
                          : emailTouched && emailValid
                            ? "text-green-400 animate-pulse"
                            : emailTouched && !emailValid
                              ? "text-red-400 animate-bounce"
                              : "text-white/50"
                      }`}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      onFocus={() => setFocusedField("email")}
                      className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 outline-none transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${getFieldBorderClass(
                        "email",
                        emailValid,
                        emailTouched,
                      )} ${getFieldRingClass("email", emailValid, emailTouched)} transform hover:scale-[1.02] focus:scale-[1.02] hover:bg-white/15 focus:bg-white/15`}
                      required
                    />
                    {emailTouched && (
                      <div className="absolute right-4 top-4">
                        {emailValid ? (
                          <CheckCircle className="h-5 w-5 text-green-400 animate-bounce-in" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-400 animate-shake" />
                        )}
                      </div>
                    )}
                    {focusedField === "email" && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse pointer-events-none" />
                    )}
                  </div>
                  {emailTouched && !emailValid && email && (
                    <p className="text-red-300 text-xs mt-1 animate-slide-down">Please enter a valid email address</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white/90">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-4 h-5 w-5 transition-all duration-300 ${
                        focusedField === "password"
                          ? "text-blue-400 scale-110"
                          : passwordTouched && passwordValid
                            ? "text-green-400 animate-pulse"
                            : passwordTouched && !passwordValid
                              ? "text-red-400 animate-bounce"
                              : "text-white/50"
                      }`}
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      onFocus={() => setFocusedField("password")}
                      className={`w-full pl-12 pr-20 py-4 border rounded-xl focus:ring-2 outline-none transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${getFieldBorderClass(
                        "password",
                        passwordValid,
                        passwordTouched,
                      )} ${getFieldRingClass("password", passwordValid, passwordTouched)} transform hover:scale-[1.02] focus:scale-[1.02] hover:bg-white/15 focus:bg-white/15`}
                      required
                    />
                    <div className="absolute right-4 top-4 flex items-center space-x-2">
                      {passwordTouched && (
                        <div>
                          {passwordValid ? (
                            <CheckCircle className="h-5 w-5 text-green-400 animate-bounce-in" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-400 animate-shake" />
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-5 w-5 text-white/50 hover:text-white transition-all duration-300 focus:outline-none hover:scale-125 transform"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {focusedField === "password" && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse pointer-events-none" />
                    )}
                  </div>
                  {passwordTouched && !passwordValid && password && (
                    <p className="text-red-300 text-xs mt-1 animate-slide-down">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white/30 rounded cursor-pointer transition-all duration-300 hover:scale-110 bg-white/10"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-300 hover:text-blue-100 font-medium transition-all duration-300 focus:outline-none focus:underline hover:scale-105 transform"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-500 disabled:via-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-blue-500/25 animate-gradient-x relative overflow-hidden"
                >
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse" />
                  )}
                  <div className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-200"></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-400"></div>
                        </div>
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </div>
                </button>
              </form>

             
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-white/60 animate-fade-in-up animation-delay-400">
            <p>© 2024 Task Management. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
