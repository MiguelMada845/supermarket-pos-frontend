import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { getAllProducts } from '../services/api'
import { mockProducts } from '../data/mockProducts'

const CACHE_KEY = 'pos_products'

export function useOfflineSync(): void {
  const store = useStore()

  useEffect(() => {
    // 1. Seed from localStorage cache first (fastest)
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        store.setProducts(JSON.parse(cached))
      } catch {
        // Malformed cache — fall through to mock data
      }
    }

    // 2. If no cache yet, seed from mock data immediately so the app works
    //    without any network at all
    if (!cached) {
      store.setProducts(mockProducts)
      localStorage.setItem(CACHE_KEY, JSON.stringify(mockProducts))
    }

    // 3. Optionally try to fetch fresh data from the API.
    //    Failures are completely silent — mock/cached data stays in place.
    const fetchAndCacheProducts = async () => {
      try {
        const products = await getAllProducts()
        store.setProducts(products)
        localStorage.setItem(CACHE_KEY, JSON.stringify(products))
      } catch {
        // Backend unavailable — keep using mock/cached data, no error shown
      }
    }

    if (navigator.onLine) {
      fetchAndCacheProducts()
    }

    // 4. Track online/offline state and re-sync when connection is restored
    const handleOnline = () => {
      store.setIsOnline(true)
      fetchAndCacheProducts()
    }

    const handleOffline = () => {
      store.setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
