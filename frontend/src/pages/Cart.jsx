import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

function Cart({ setLoading }) {
  const navigate = useNavigate()

  const [cart, setCart] = useState({})
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [payment, setPayment] = useState('')
  const [show, setShow] = useState(false)
  const [deliveryCharge, setDeliveryCharge] = useState(0)

  const getRandomDelivery = () => {
    return Math.floor(Math.random() * 51) + 50
  }

  useEffect(() => {
    setDeliveryCharge(getRandomDelivery())
  }, [state])

  useEffect(() => {
    fetchCartData()
  }, [])

  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + 4)

  const fetchCartData = async () => {
    setLoading(true)

    try {
      const data = await api('/cart')
      if (!data) return

      setCart(data.data)
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    } finally {
      setLoading(false)
    }
  }

  const deleteCartItem = async (id) => {
    try {
      const data = await api(`/cart/product/${id}`, { method: 'DELETE' })
      if (!data) return

      fetchCartData()
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const confirmation = confirm('Kya Aap Yah Order Place Karna Chahte Hain')

    if (!confirmation) return

    try {
      const data = await api('/add/order', {
        method: 'POST',
        body: JSON.stringify({
          address,
          city,
          state,
          payment,
          futureDate,
          deliveryCharge,
        }),
      })

      if (!data) return

      toast.success('Order Confirmed')
      navigate('/order')
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    }
  }

  const cartAllItemsOrder = async (e) => {
    setShow(true)
    e.preventDefault()
  }

  const grandTotal = cart?.products?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  const handleQtyUpdate = async (id, action) => {
    try {
      const data = await api(`/cart/product/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      })
      if (!data) return

      fetchCartData()
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    }
  }

  return (
    <div className="bg-white p-7 rounded-xl">
      <h2 className="text-2xl font-bold">
        Your Cart ({cart?.products?.length})
      </h2>

      <div>
        {cart?.products?.map((item) => (
          <div
            key={item._id}
            className="bg-transparent flex gap-5 justify-start items-start mt-7.5"
          >
            <div>
              <img className="w-24 rounded" src={item.image} alt={item.title} />
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>Price: {+item.price}</p>
              <p>Qty: {+item.quantity}</p>
              <p>Total: {+item.price * +item.quantity}</p>
              <aside className="flex gap-2.5">
                <section className="flex gap-4 bg-blue-600 text-white rounded px-1 py-0.5">
                  <button
                    className="flex justify-center items-center cursor-pointer"
                    onClick={() => handleQtyUpdate(item._id, 'decrease')}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <p className="font-bold">{item.quantity}</p>
                  <button
                    className="flex justify-center items-center cursor-pointer"
                    onClick={() => handleQtyUpdate(item._id, 'increase')}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </section>
                <button
                  className="cursor-pointer bg-blue-600 text-white rounded px-1 py-0.5 flex justify-center items-center gap-1"
                  onClick={() => deleteCartItem(item._id)}
                >
                  <i className="fa-solid fa-trash"></i>Remove
                </button>
              </aside>
            </div>
          </div>
        ))}
        {cart?.products?.length !== 0 && (
          <h3 className="font-bold mt-5">Total Amount: {grandTotal}</h3>
        )}
      </div>

      {cart?.products?.length !== 0 && (
        <button
          className="bg-green-500 text-white w-full p-2 rounded cursor-pointer my-3 text-[18px]"
          onClick={cartAllItemsOrder}
        >
          Buy All Items
        </button>
      )}

      {show && (
        <form onSubmit={handleFormSubmit}>
          <h2>Address</h2>
          <div>
            <input
              className="mb-2.5 w-full py-2 px-4 text-base border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              required
              placeholder="Address"
            />
            <input
              className="mb-2.5 w-full py-2 px-4 text-base border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              required
              placeholder="City"
            />
            <input
              className="mb-2.5 w-full py-2 px-4 text-base border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
              value={state}
              onChange={(e) => setState(e.target.value)}
              type="text"
              required
              placeholder="State"
            />
          </div>

          <div className="payment-mode">
            <h2>Payment</h2>
            <div className="mb-2.5 w-full py-2 px-4 border border-gray-300 rounded-lg hover:border-blue-600 hover:ring-2 hover:ring-blue-200 transition">
              <input
                required
                value="Net Banking"
                onChange={(e) => setPayment(e.target.value)}
                type="radio"
                name="payment"
                id="net-banking"
                className="align-middle mr-2"
              />
              <label htmlFor="net-banking">Net Banking</label>
            </div>

            <div className="mb-2.5 w-full py-2 px-4 border border-gray-300 rounded-lg hover:border-blue-600 hover:ring-2 hover:ring-blue-200 transition">
              <input
                required
                value="Cash On Delivery"
                onChange={(e) => setPayment(e.target.value)}
                type="radio"
                name="payment"
                id="cod"
                className="align-middle mr-2"
              />
              <label htmlFor="cod">Cash On Delivery</label>
            </div>
          </div>

          <section>
            <p>Payment Method: {payment}</p>
            <p>Price: {grandTotal}</p>
            <p>Delivery Charges: {deliveryCharge}</p>
            <p>Total Amount: {grandTotal + deliveryCharge}</p>
            <p>Arriving By: {futureDate.toDateString()}</p>
          </section>

          <button
            className="bg-yellow-500 text-white w-full p-2 rounded cursor-pointer my-3 text-[18px]"
            type="submit"
          >
            Place Order
          </button>
        </form>
      )}
    </div>
  )
}

export default Cart
