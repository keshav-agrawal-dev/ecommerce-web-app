import { useNavigate, useParams } from 'react-router-dom'
import products from '../../data/data'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

function ProductDetails({ setLoading }) {
  const [quantity, setQuantity] = useState(1)
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  const navigate = useNavigate()

  const addToCart = async () => {
    setLoading(true)

    try {
      const data = await api('/addproduct', {
        method: 'POST',
        body: JSON.stringify({ product, quantity }),
      })
      if (!data) return

      toast.success('Product Added To Cart')
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleBuy = () => {
    navigate('/checkout', {
      state: {
        productId: id,
        quantity: quantity,
      },
    })
  }

  if (!product) return <h2>Product Not Found</h2>

  return (
    <div className="flex flex-col md:flex-row gap-10 bg-white p-4 rounded-[10px]">
      <img
        className="flex-1 rounded-md md:w-100"
        src={product.image}
        alt={product.title}
      />

      <div className="">
        <h2 className="text-2xl font-medium">{product.title}</h2>
        <p className="my-2.5">₹{product.price}</p>
        <p>{product.description}</p>
        <section className="flex items-center gap-2.5">
          <label htmlFor="select-menu">Quantity</label>
          <select
            id="select-menu"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="cursor-pointer rounded border"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </section>

        <aside className="w-full p-1 mt-2.5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 justify-center border">
            <p className="text-[14px]">Cash On Delivery</p>
          </div>
          <div className="flex items-center gap-2 justify-center border">
            <p className="text-[14px]">10 Days Returnable</p>
          </div>
          <div className="flex items-center gap-2 justify-center border">
            <p className="text-[14px]">Fast Delivery</p>
          </div>
          <div className="flex items-center gap-2 justify-center border">
            <p className="text-[14px]">ShopPro Delivered</p>
          </div>
        </aside>
        <div className="flex flex-col gap-2.5 mt-5">
          <button
            className="py-2 px-5 border-none text-white rounded-md cursor-pointer flex-1 bg-green-500"
            onClick={addToCart}
          >
            Add to Cart
          </button>
          <button
            className="py-2 px-5 border-none text-white rounded-md cursor-pointer flex-1 bg-blue-500"
            onClick={handleBuy}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
