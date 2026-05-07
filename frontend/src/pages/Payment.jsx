import { useEffect, useState } from 'react'
import products from '../../data/data'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

export default function Payment() {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [payment, setPayment] = useState('')
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  const lState = location.state

  useEffect(() => {
    if (!lState) {
      navigate('/')
    }
  }, [])

  const { productId, quantity } = location.state || {}

  const product = products.find((p) => p.id === Number(productId))

  if (!product) {
    return <h2>Product Not Found</h2>
  }

  let title, description, price, image, delivery

  if (product) {
    ;({ title, description, price, image, delivery } = product)
  } else {
    title = '---'
    description = '---'
    price = 0
    image = '---'
    delivery = 0
  }

  const getRandomDelivery = () => {
    return Math.floor(Math.random() * 51) + 50
  }
  useEffect(() => {
    setDeliveryCharge(getRandomDelivery())
  }, [state])

  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + 4)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const confirmation = confirm('Kya Aap Yah Order Place Karna Chahte Hain')

    if (!confirmation) return

    try {
      const data = await api('/add/order', {
        method: 'POST',
        body: JSON.stringify({
          product,
          address,
          city,
          state,
          payment,
          quantity,
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

  return (
    <form onSubmit={handleFormSubmit}>
      <h2>Address</h2>
      <div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          required
          placeholder="Address"
          className="mb-2.5 w-full py-2 px-4 text-base border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text"
          required
          placeholder="City"
          className="mb-2.5 w-full py-2 px-4 text-base border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
        />
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          type="text"
          required
          placeholder="State"
          className="mb-2.5 w-full py-2 px-4 text-base border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
        />
      </div>

      <div className="payment-mode">
        <h2>Payment</h2>
        <div className="mb-2.5 w-full py-2 px-4 border border-gray-300 rounded-lg hover:border-blue-600 hover:ring-2 hover:ring-blue-200 transition">
          <input
            required
            value="Pay Online"
            onChange={(e) => setPayment(e.target.value)}
            type="radio"
            name="payment"
            id="pay-online"
            className="align-middle mr-2"
          />
          <label htmlFor="pay-online">Pay Online</label>
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
        <p>Price: {quantity * price}</p>
        <p>Delivery Charges: {deliveryCharge}</p>
        <p>Total Amount: {quantity * price + deliveryCharge}</p>
        <p>Arriving By: {futureDate.toDateString()}</p>
      </section>

      <button
        className="bg-yellow-500 text-white w-full p-2 rounded cursor-pointer my-3 text-[18px]"
        type="submit"
      >
        Place Order
      </button>
    </form>
  )
}
