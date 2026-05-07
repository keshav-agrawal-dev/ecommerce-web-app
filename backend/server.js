const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authMiddleware = require('./middleware/authMiddleware')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDb Connected')
})

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const cartSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      id: Number,
      title: String,

      price: Number,
      image: String,
      description: String,
      quantity: Number,
    },
  ],
})

const orderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  products: [
    {
      id: Number,
      title: String,

      price: Number,
      image: String,
      description: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  delivery: Number,

  totalAmount: {
    type: Number,
  },
  paymentMethod: {
    type: String,
  },

  orderStatus: {
    type: String,
    default: 'Ordered',
  },

  address: {
    fullAddress: String,
    city: String,
    state: String,
  },
  futureDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model('User', userSchema)
const Cart = mongoose.model('Cart', cartSchema)
const Order = mongoose.model('Order', orderSchema)

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const exist = await User.findOne({ email })
    if (exist) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)

    await User.create({
      name,
      phone,
      email,
      password: hashed,
    })

    res.status(201).json({ message: 'Signup successful' })
  } catch (err) {
    res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: 'Invalid Email Or Password' })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.get('/cart', authMiddleware, async (req, res) => {
  try {
    const cartItems = await Cart.findOne({ userid: req.user._id })

    return res
      .status(200)
      .json({ message: 'All Data Here', data: cartItems ? cartItems : {} })
  } catch (err) {
    console.log('Error: ', err.message)
    return res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.post('/addproduct', authMiddleware, async (req, res) => {
  try {
    const { product, quantity } = req.body

    let cart = await Cart.findOne({
      userid: req.user._id,
    })

    if (!cart) {
      cart = new Cart({
        userid: req.user._id,
        products: [{ ...product, quantity: quantity || 1 }],
      })

      await cart.save()
      return res.status(200).json({ message: 'Product Added To Cart' })
    }

    const isProductExist = cart.products.find((p) => p.id === product.id)

    if (isProductExist) {
      isProductExist.quantity += quantity || 1
    } else {
      cart.products.push({ ...product, quantity: quantity || 1 })
    }

    await cart.save()
    return res.status(200).json({ message: 'Product Added To Cart' })
  } catch (err) {
    console.log('Error: ', err.message)
    return res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.delete('/cart/product/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const cartItemm = await Cart.findOne({ userid: req.user._id })

    if (!cartItemm) {
      return res.status(404).json({ message: 'Cart Not Found' })
    }

    cartItemm.products = cartItemm.products.filter((item) => {
      return item._id.toString() !== id
    })

    await cartItemm.save()

    return res.status(200).json({ message: 'Item Deleted' })
  } catch (err) {
    console.log('Error: ', err.message)
    return res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.get('/order', authMiddleware, async (req, res) => {
  try {
    const orderItems = await Order.find({ userid: req.user._id })

    return res.status(200).json({ message: 'All Data Here', data: orderItems })
  } catch (err) {
    console.log('Error: ', err.message)
    return res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.post('/add/order', authMiddleware, async (req, res) => {
  try {
    const {
      product,
      address,
      city,
      state,
      payment,
      quantity,
      futureDate,
      deliveryCharge,
    } = req.body

    let products = []

    if (product) {
      products.push({
        ...product,
        quantity: quantity || 1,
      })

      await Order.create({
        userid: req.user._id,
        products: products,
        delivery: deliveryCharge,
        totalAmount: product.price * quantity,
        paymentMethod: payment,
        address: {
          fullAddress: address,
          city: city,
          state: state,
        },
        futureDate,
      })
    } else {
      const cart = await Cart.findOne({ userid: req.user._id })

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({
          message: 'Empty Cart',
        })
      }

      products = cart.products.map((item) => ({
        ...item.toObject(),
      }))

      const totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      )

      await Order.create({
        userid: req.user._id,
        products: products,
        delivery: deliveryCharge,
        totalAmount: totalPrice,
        paymentMethod: payment,
        address: {
          fullAddress: address,
          city: city,
          state: state,
        },
        futureDate,
      })

      cart.products = []
      await cart.save()
    }

    res.status(201).json({
      message: 'Order Placed Successfully',
    })
  } catch (err) {
    console.log('Error: ', err.message)
    return res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.delete('/order/product/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    let order = await Order.findOne({ _id: id, userid: req.user._id })

    if (!order) {
      return res.status(404).json({ message: 'Order Not Found' })
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ message: 'Order Already Delivered' })
    }

    order.orderStatus = 'Cancelled'

    await order.save()

    return res.status(200).json({ message: 'Order Cancelled' })
  } catch (err) {
    console.log('Error: ', err.message)
    return res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.patch('/cart/product/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { action } = req.body

    let cart = await Cart.findOne({ userid: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart Not Found' })
    }
    const product = cart.products.find((item) => item._id.toString() === id)

    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' })
    }

    if (action === 'increase') {
      product.quantity += 1
    }

    if (action === 'decrease') {
      if (product.quantity > 1) {
        product.quantity -= 1
      } else {
        cart.products = cart.products.filter(
          (item) => item._id.toString() !== id,
        )
      }
    }

    await cart.save()

    return res.status(200).json({ message: 'Item Updated' })
  } catch (err) {
    console.log('Error: ', err.message)
    return res.status(500).json({ message: 'Server Error Problem' })
  }
})

app.listen(PORT, () => {
  console.log(`Port Running On ${PORT}`)
})
