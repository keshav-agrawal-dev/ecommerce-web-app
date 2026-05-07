import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Error from './pages/Error'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import Checkout from './pages/Checkout'
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [isLogin, setIsLogin] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  }, [])

  return (
    <BrowserRouter>
      <Navbar
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />

      <div className="p-6">
        <Routes>
          <Route path="*" element={<Error />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart setLoading={setLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={<ProductDetails setLoading={setLoading} />}
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Orders setLoading={setLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        closeOnClick
        pauseOnHover
      />
      {loading && <Loader />}
    </BrowserRouter>
  )
}

export default App
