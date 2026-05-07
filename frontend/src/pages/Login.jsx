import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

function Login({ setIsLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogedIn, setIsLogedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      setIsLogedIn(true)
    } else {
      setIsLogedIn(false)
    }
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!email || !password) return
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!data) return

      localStorage.setItem('token', data.token)
      toast.success('Welcome ' + data.user.name)
      setIsLogin(true)
      navigate('/')
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
      <h2>Login</h2>

      <input
        disabled={isLogedIn}
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="my-2 p-2 mx-0 border border-gray-300 rounded-md disabled:cursor-not-allowed outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
      />

      <div className="relative">
        <input
          disabled={isLogedIn}
          type={showPassword ? 'text' : 'password'}
          required
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
        className="mt-4 px-3 py-2 border-none bg-blue-600 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
        disabled={isLogedIn}
        type="submit"
      >
        Login
      </button>
    </form>
  )
}

export default Login
