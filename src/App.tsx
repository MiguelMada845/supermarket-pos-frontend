import { ProductSearch } from './components/ProductSearch'
import { BarcodeScanner } from './components/BarcodeScanner'
import { Cart } from './components/Cart'
import { useOfflineSync } from './hooks/useOfflineSync'

function App() {
  useOfflineSync()
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-wide">Supermarket POS</h1>
        </div>
      </header>

      {/* Main content: two-column on lg+, stacked on mobile */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left column: scanner + search */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <BarcodeScanner />
          <ProductSearch />
        </div>

        {/* Right column: cart (sticky on large screens) */}
        <div className="w-full lg:w-96 lg:sticky lg:top-6">
          <Cart />
        </div>
      </main>
    </div>
  )
}

export default App
