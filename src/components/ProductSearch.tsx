import { useState, useEffect, useCallback } from 'react'
import { useStore } from '../store/useStore'
import type { Product } from '../store/useStore'

const CATEGORIES = [
  'All',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Meat',
  'Beverages',
  'Other',
]

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [results, setResults] = useState<Product[]>([])

  const { products, addToCart } = useStore()

  // Always search locally from the store (seeded with mock data or API cache).
  // No network calls here — the API sync happens in useOfflineSync.
  const performSearch = useCallback(
    (searchQuery: string, searchCategory: string) => {
      if (!searchQuery && searchCategory === 'All') {
        setResults([])
        return
      }

      const filtered = products.filter((p) => {
        const matchesQuery =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory =
          searchCategory === 'All' || p.category === searchCategory
        return matchesQuery && matchesCategory
      })

      setResults(filtered)
    },
    [products]
  )

  // Debounce: 300ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query, category)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, category, performSearch])

  const hasSearched = query !== '' || category !== 'All'

  return (
    <div className="p-4">
      {/* Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* No results */}
      {hasSearched && results.length === 0 && (
        <p className="text-center text-gray-500 text-lg py-12">
          No products found
        </p>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 leading-tight">
          {product.name}
        </h3>
        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full">
          {product.category}
        </span>
      </div>
      <p className="text-2xl font-bold text-green-600">
        ${product.price.toFixed(2)}
      </p>
      <button
        type="button"
        onClick={() => onAddToCart(product)}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-semibold rounded-xl transition-colors cursor-pointer"
        aria-label={`Add ${product.name} to cart`}
      >
        Add to Cart
      </button>
    </div>
  )
}
