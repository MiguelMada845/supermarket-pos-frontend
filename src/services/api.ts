import axios from 'axios'
import type { Product, CartItem } from '../store/useStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

export async function searchProducts(
  query: string,
  category?: string
): Promise<Product[]> {
  try {
    const params: Record<string, string> = { search: query }
    if (category && category !== 'All') {
      params.category = category
    }
    const response = await api.get<Product[]>('/products', { params })
    return response.data
  } catch (error) {
    throw new Error(
      `Failed to search products: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>('/products')
    return response.data
  } catch (error) {
    throw new Error(
      `Failed to fetch products: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export async function getProductByBarcode(
  barcode: string
): Promise<Product | null> {
  try {
    const response = await api.get<Product[]>('/products', {
      params: { barcode },
    })
    return response.data.length > 0 ? response.data[0] : null
  } catch (error) {
    throw new Error(
      `Failed to fetch product by barcode: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export async function checkout(
  cart: CartItem[],
  paymentMethod: string
): Promise<{ success: boolean; receiptId: string }> {
  try {
    const response = await api.post<{ success: boolean; receiptId: string }>(
      '/checkout',
      { cart, paymentMethod }
    )
    return response.data
  } catch (error) {
    throw new Error(
      `Checkout failed: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
