import  React from "react"
import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle, User, Sparkles, Zap, UserPlus } from "lucide-react"
import { register } from "./api/user"
import { useSearchParams, useNavigate } from "react-router-dom"

export default function RegistrationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [firstNameTouched, setFirstNameTouched] = useState(false)
  const [lastNameTouched, setLastNameTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [firstNameValid, setFirstNameValid] = useState(false)
  const [lastNameValid, setLastNameValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [focusedField, setFocusedField] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [floatingShapes, setFloatingShapes] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const canvasRef = useRef(null)
  const animationRef = useRef()

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

  // Real-time validation
  useEffect(() => {
    setFirstNameValid(firstName.trim().length >= 2)
  }, [firstName])

  useEffect(() => {
    setLastNameValid(lastName.trim().length >= 2)
  }, [lastName])

  useEffect(() => {
    setPasswordValid(password.length >= 6)
  }, [password])

  // Typing detection
  useEffect(() => {
    if (firstName || lastName || password) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [firstName, lastName, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)
    setShowSparkles(true)

    // Mark fields as touched
    setFirstNameTouched(true)
    setLastNameTouched(true)
    setPasswordTouched(true)

    try {
      // Validation
      if (!firstName || !lastName || !password) {
        setError("Please fill in all fields")
        setIsLoading(false)
        setShowSparkles(false)
        return
      }

      if (!firstNameValid) {
        setError("First name must be at least 2 characters long")
        setIsLoading(false)
        setShowSparkles(false)
        return
      }

      if (!lastNameValid) {
        setError("Last name must be at least 2 characters long")
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

      if (!agreeToTerms) {
        setError("Please agree to the terms and conditions")
        setIsLoading(false)
        setShowSparkles(false)
        return
      }

      const response = await register({
        token,
        firstName,
        lastName,
        password
      })
      
      setSuccess("Registration successful! Redirecting to login...")

      // Redirect to login page after success
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
      setShowSparkles(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldBorderClass = (field, isValid, isTouched) => {
    if (!isTouched) return "border-gray-200 focus:border-blue-500"
    if (isValid) return "border-green-500 focus:border-green-500"
    return "border-red-500 focus:border-red-500"
  }

  const getFieldRingClass = (field, isValid, isTouched) => {
    if (!isTouched) return "focus:ring-blue-500/20"
    if (isValid) return "focus:ring-green-500/20"
    return "focus:ring-red-500/20"
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
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
      <div className="relative z-30 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {/* Project Title */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-6 shadow-2xl animate-bounce-slow">
              <UserPlus className="w-10 h-10 text-white" />
              {showSparkles && (
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -bottom-1 -left-1" />
                  <Zap className="w-5 h-5 text-yellow-400 absolute top-1 left-1" />
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-3 text-white tracking-tight">Task Management</h1>
            
            {isTyping && (
              <div className="mt-3 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-400"></div>
                </div>
              </div>
            )}
          </div>

          {/* Registration Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up animation-delay-200">
            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-white/10">
              <h2 className="text-2xl font-bold text-center text-white mb-2">Create Account</h2>
            </div>

            {/* Card Content */}
            <div className="px-8 py-8 bg-white/5 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Success Alert */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start space-x-3 animate-fade-in">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0 animate-spin-once" />
                    <p className="text-green-200 text-sm font-semibold">{success}</p>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3 animate-shake-intense">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
                    <p className="text-red-200 text-sm font-semibold">{error}</p>
                  </div>
                )}

                {/* Name Fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-white/90 mb-2">
                      First Name
                    </label>
                    <div className="relative group">
                      <User
                        className={`absolute left-3 top-3.5 h-4 w-4 transition-all duration-300 ${
                          focusedField === "firstName"
                            ? "text-blue-400"
                            : firstNameTouched && firstNameValid
                              ? "text-green-400"
                              : firstNameTouched && !firstNameValid
                                ? "text-red-400"
                                : "text-white/60"
                        }`}
                      />
                      <input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => setFirstNameTouched(true)}
                        onFocus={() => setFocusedField("firstName")}
                        className={`w-full pl-10 pr-10 py-3.5 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white/10 text-white placeholder-white/50 font-medium backdrop-blur-sm ${getFieldBorderClass(
                          "firstName",
                          firstNameValid,
                          firstNameTouched,
                        )} ${getFieldRingClass("firstName", firstNameValid, firstNameTouched)} transform hover:scale-[1.01] focus:scale-[1.01]`}
                        required
                      />
                      {firstNameTouched && (
                        <div className="absolute right-3 top-3.5">
                          {firstNameValid ? (
                            <CheckCircle className="h-4 w-4 text-green-400 animate-bounce-in" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400 animate-shake" />
                          )}
                        </div>
                      )}
                    </div>
                    {firstNameTouched && !firstNameValid && firstName && (
                      <p className="text-red-300 text-xs mt-1 font-medium animate-slide-down">At least 2 characters</p>
                    )}
                  </div>

                  {/* Last Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-white/90 mb-2">
                      Last Name
                    </label>
                    <div className="relative group">
                      <User
                        className={`absolute left-3 top-3.5 h-4 w-4 transition-all duration-300 ${
                          focusedField === "lastName"
                            ? "text-blue-400"
                            : lastNameTouched && lastNameValid
                              ? "text-green-400"
                              : lastNameTouched && !lastNameValid
                                ? "text-red-400"
                                : "text-white/60"
                        }`}
                      />
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => setLastNameTouched(true)}
                        onFocus={() => setFocusedField("lastName")}
                        className={`w-full pl-10 pr-10 py-3.5 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white/10 text-white placeholder-white/50 font-medium backdrop-blur-sm ${getFieldBorderClass(
                          "lastName",
                          lastNameValid,
                          lastNameTouched,
                        )} ${getFieldRingClass("lastName", lastNameValid, lastNameTouched)} transform hover:scale-[1.01] focus:scale-[1.01]`}
                        required
                      />
                      {lastNameTouched && (
                        <div className="absolute right-3 top-3.5">
                          {lastNameValid ? (
                            <CheckCircle className="h-4 w-4 text-green-400 animate-bounce-in" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400 animate-shake" />
                          )}
                        </div>
                      )}
                    </div>
                    {lastNameTouched && !lastNameValid && lastName && (
                      <p className="text-red-300 text-xs mt-1 font-medium animate-slide-down">At least 2 characters</p>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-4 h-5 w-5 transition-all duration-300 ${
                        focusedField === "password"
                          ? "text-blue-400"
                          : passwordTouched && passwordValid
                            ? "text-green-400"
                            : passwordTouched && !passwordValid
                              ? "text-red-400"
                              : "text-white/60"
                      }`}
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      onFocus={() => setFocusedField("password")}
                      className={`w-full pl-12 pr-16 py-4 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-300 bg-white/10 text-white placeholder-white/50 font-medium backdrop-blur-sm ${getFieldBorderClass(
                        "password",
                        passwordValid,
                        passwordTouched,
                      )} ${getFieldRingClass("password", passwordValid, passwordTouched)} transform hover:scale-[1.01] focus:scale-[1.01]`}
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
                        className="h-5 w-5 text-white/60 hover:text-white transition-all duration-300 focus:outline-none hover:scale-110 transform"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  {passwordTouched && !passwordValid && password && (
                    <p className="text-red-300 text-sm mt-2 font-medium animate-slide-down">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3 pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-white/30 rounded cursor-pointer transition-all duration-300 hover:scale-110 mt-1 bg-white/10"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors font-medium leading-relaxed"
                  >
                    I agree to the{" "}
                    <button type="button" className="text-blue-300 hover:text-blue-200 font-semibold underline">
                      Terms and Conditions
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-blue-300 hover:text-blue-200 font-semibold underline">
                      Privacy Policy
                    </button>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-400/80 to-blue-400/80 hover:from-green-400 hover:to-blue-400 disabled:from-gray-400/50 disabled:to-gray-500/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/20 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-lg backdrop-blur-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-white/80 animate-fade-in-up animation-delay-400 font-medium">
            <p>© 2024 Task Management. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
