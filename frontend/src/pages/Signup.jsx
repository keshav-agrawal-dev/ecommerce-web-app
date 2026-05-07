import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

function Signup() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const userSignup = localStorage.getItem('isUserSignup')

    if (userSignup) {
      setIsSignup(true)
      navigate('/login')
    } else {
      setIsSignup(false)
    }
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!name || !phone || !email || !password) return

      const data = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, phone, email, password }),
      })

      if (!data) return
      toast.success('Registered Successfully')
      localStorage.setItem('isUserSignup', JSON.stringify(true))
      navigate('/login')
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-87.5 mx-auto my-12 bg-white p-8 rounded-lg flex flex-col"
    >
      <h2>Signup</h2>

      <input
        disabled={isSignup}
        type="text"
        required
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="my-2 p-2 mx-0 border border-gray-300 rounded-md disabled:cursor-not-allowed outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
      />
      <input
        disabled={isSignup}
        type="tel"
        required
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="my-2 p-2 mx-0 border border-gray-300 rounded-md disabled:cursor-not-allowed outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
      />

      <input
        disabled={isSignup}
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="my-2 p-2 mx-0 border border-gray-300 rounded-md disabled:cursor-not-allowed outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
      />

      <div className="relative">
        <input
          disabled={isSignup}
          type={showPassword ? 'text' : 'password'}
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full my-2 p-2 mx-0 border border-gray-300 rounded-md disabled:cursor-not-allowed outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
        />
        <span
          className="absolute right-0 top-0 text-xs bg-white cursor-default select-none"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <i className="fa-solid fa-eye"></i>
          ) : (
            <i className="fa-solid fa-eye-slash"></i>
          )}
        </span>
      </div>

      <button
        disabled={isSignup}
        type="submit"
        className="mt-4 px-3 py-2 border-none bg-blue-600 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
      >
        Create Account
      </button>
    </form>
  )
}

export default Signup
