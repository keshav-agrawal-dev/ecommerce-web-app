const BASE_URL = 'https://ecommerce-web-app-0rwo.onrender.com'

export const api = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(BASE_URL + url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
        ...options.headers,
      },
    })

    const data = await res.json()

    if (res.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return null
    }
    if (!res.ok) {
      throw new Error(data.message || 'Something Went Wrong')
    }

    return data
  } catch (err) {
    throw err
  }
}
