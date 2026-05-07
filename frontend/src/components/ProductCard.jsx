import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const addToCart = async () => {
    try {
      const data = await api(
        '/addproduct',
        {
          method: 'POST',
          body: JSON.stringify({ product, quantity: 1 }),
        },
        navigate,
      )

      if (!data) return

      toast.success(data.message)
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white p-5 rounded-xl text-center shadow-lg hover:-translate-y-1 transition">
      <img
        src={product.image}
        alt={product.title}
        onClick={() => navigate(`/product/${product.id}`)}
        className="w-full rounded-[10px] cursor-pointer"
      />

      <div className="grow">
        <h3 className="my-2 font-medium">{product.title}</h3>
        <span className="line-through">
          ₹{product.price + (product.price * 10) / 100}
        </span>
        &nbsp; &nbsp;
        <span className="price">₹{product.price}</span>
      </div>

      <button
        className="mx-auto mt-2.5 cursor-pointer px-4 py-2.5 border-none bg-blue-600 text-white rounded-md w-full max-w-100 flex justify-center items-center"
        onClick={addToCart}
      >
        <i className="fa-solid fa-cart-shopping"></i>Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
