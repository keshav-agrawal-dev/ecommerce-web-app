import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../utils/api'

export default function Orders({ setLoading }) {
  const [order, setOrder] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrderData()
  }, [])

  const fetchOrderData = async () => {
    setLoading(true)

    try {
      const data = await api('/order', { method: 'GET' })
      if (!data) return
      setOrder(data.data)
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    } finally {
      setLoading(false)
    }
  }

  const deleteOrderItem = async (id) => {
    const userAns = confirm('Kya Aap Yah Order Cancel Karna Chahte Hain.')
    if (!userAns) return

    try {
      const data = await api(`/order/product/${id}`, { method: 'DELETE' })
      if (!data) return

      toast.success('Order Cancel Successfully')
      fetchOrderData()
    } catch (err) {
      console.log('Error: ', err.message || 'Something Went Wrong')
      toast.error(err.message || 'Something Went Wrong')
    }
  }

  return (
    <div>
      {order.length > 0 ? (
        [...order].reverse().map((order) => (
          <div key={order._id} className="bg-white p-4 rounded mb-5 shadow">
            <p>
              <b>Order Date:</b>{' '}
              {new Date(order.createdAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </p>

            <p>
              <b>Status:</b>{' '}
              <span
                className={
                  order.orderStatus === 'Cancelled'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }
              >
                {order.orderStatus}
              </span>
            </p>
            <p>
              <b>Payment:</b> <span>{order.paymentMethod}</span>
            </p>
            <p>
              <b>Total:</b> <span>₹{order.totalAmount}</span>
            </p>
            <p>
              <b>Delivery Charges:</b> <span>₹{order.delivery}</span>
            </p>
            <p
              className={
                order.orderStatus === 'Cancelled' ? 'line-through' : ''
              }
            >
              <b>Total Amount:</b>{' '}
              <span>₹{order.totalAmount + order.delivery}</span>
            </p>
            <p
              className={
                order.orderStatus === 'Cancelled' ? 'line-through' : ''
              }
            >
              <b>Estimated Delivery Date:</b>{' '}
              <span>
                {new Date(order.futureDate).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </p>
            <button
              onClick={() => deleteOrderItem(order._id)}
              disabled={order.orderStatus === 'Cancelled'}
              title="Cancel This Order"
              className={`${order.orderStatus === 'Cancelled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 cursor-pointer'} text-white px-1 py-0.5 rounded w-full`}
            >
              CANCEL
            </button>

            {order.products.map((item) => (
              <div key={item._id} className="flex gap-4 mt-4 border-t pt-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 rounded"
                />

                <div>
                  <p>{item.title}</p>
                  <p>Price: ₹{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Total: ₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No Orders Found</p>
      )}
    </div>
  )
}
