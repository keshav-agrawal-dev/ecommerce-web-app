import { useState } from 'react'
import productsData from '../../data/data'
import ProductCard from '../components/ProductCard'

function Home() {
  const [search, setSearch] = useState('')

  const filtered = productsData.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="home">
      <div className="text-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
          className="w-[90%] p-3 rounded-full border border-gray-300 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Home
