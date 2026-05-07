import { Link } from 'react-router-dom'

function Sidebar({ open, close }) {
  return (
    <div
      className={`${open ? 'fixed top-0 left-0 w-62.5 h-full bg-blue-600 flex flex-col p-8 transition-all duration-300 z-50' : 'fixed top-0 -left-62.5 w-62.5 h-full bg-gray-800 flex flex-col p-8 transition-all duration-300 z-50'}`}
    >
      <button
        className="self-end bg-none border-none text-white cursor-pointer text-xl"
        onClick={close}
      >
        ✖
      </button>
      <Link
        className="text-white no-underline text-[18px] my-3.5"
        to="/"
        onClick={close}
      >
        <i className="fa-solid fa-house"></i> Home
      </Link>
      <Link
        className="text-white no-underline text-[18px] my-3.5"
        to="/cart"
        onClick={close}
      >
        <i className="fa-solid fa-cart-shopping"></i> Cart
      </Link>
      <Link
        className="text-white no-underline text-[18px] my-3.5"
        to="/order"
        onClick={close}
      >
        <i className="fa-solid fa-bag-shopping"></i> Orders
      </Link>
      <Link
        className="text-white no-underline text-[18px] my-3.5"
        to="/login"
        onClick={close}
      >
        <i className="fa-solid fa-right-to-bracket"></i> Login
      </Link>
      <Link
        className="text-white no-underline text-[18px] my-3.5"
        to="/signup"
        onClick={close}
      >
        <i className="fa-solid fa-user"></i> Signup
      </Link>
    </div>
  )
}

export default Sidebar
