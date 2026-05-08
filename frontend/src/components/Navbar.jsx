import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Navbar({ isLogin, setIsLogin, toggleSidebar }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    toast.success('Logout Successfully')

    localStorage.removeItem('token')
    setIsLogin(false)
    navigate('/login')
  }
  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <button
        className="bg-transparent border-none text-2xl cursor-pointer text-white"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <Link to="/" className="text-white text-[22px] font-bold no-underline">
        ShopPro
      </Link>

      <div className="nav-links">
        {!isLogin && (
          <Link
            className="text-white ml-5 font-medium no-underline cursor-pointer"
            to="/login"
          >
            <i className="fa-solid fa-right-to-bracket"></i>
          </Link>
        )}
        {!isLogin && (
          <Link
            className="text-white ml-5 font-medium no-underline cursor-pointer"
            to="/signup"
          >
            <i className="fa-solid fa-user"></i>
          </Link>
        )}

        {isLogin && (
          <button
            className="text-white font-medium cursor-pointer"
            onClick={handleLogout}
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        )}
        <Link
          className="text-white ml-5 font-medium no-underline cursor-pointer"
          to="/cart"
          title="Cart"
        >
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
