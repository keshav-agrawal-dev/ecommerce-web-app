import { useLocation, useNavigate } from 'react-router-dom'
import products from '../../data/data'
import { useEffect } from 'react'

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.state) {
      navigate('/')
      return null
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
  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 bg-white p-4 rounded-[10px]">
        <img src={image} alt={title} className="w-100 rounded-md" />

        <div className="details-info">
          <h2 className="text-2xl font-medium">{title}</h2>
          <p>{description}</p>
          <p className="my-2.5">₹{price}</p>
          <p className="my-2.5">Qty: {quantity}</p>
          <p className="my-2.5">Total Amount: {price * quantity}</p>

          <div className="flex flex-col gap-2.5 mt-5">
            <button
              className="py-2 px-5 border-none text-white rounded-md cursor-pointer flex-1 bg-green-500"
              onClick={() =>
                navigate('/payment', {
                  state: {
                    productId,
                    quantity,
                  },
                })
              }
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
