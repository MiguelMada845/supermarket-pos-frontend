import { create } from 'zustand'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  barcode?: string
  stock?: number
}

export interface CartItem extends Product {
  quantity: number
  discount: number
}

interface StoreState {
  products: Product[]
  searchResults: Product[]
  cart: CartItem[]
  total: number
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed'
  isOnline: boolean
  setProducts: (products: Product[]) => void
  setSearchResults: (results: Product[]) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  applyDiscount: (productId: string, discount: number) => void
  clearCart: () => void
  setPaymentStatus: (status: StoreState['paymentStatus']) => void
  setIsOnline: (online: boolean) => void
}

function computeTotal(cart: CartItem[]): number {
  const subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity * (1 - item.discount / 100)
  }, 0)
  return subtotal * 1.1 // 10% tax
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  searchResults: [],
  cart: [],
  total: 0,
  paymentStatus: 'idle',
  isOnline: navigator.onLine,

  setProducts: (products) => set({ products }),

  setSearchResults: (results) => set({ searchResults: results }),

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id)
      let newCart: CartItem[]
      if (existing) {
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newCart = [...state.cart, { ...product, quantity: 1, discount: 0 }]
      }
      return { cart: newCart, total: computeTotal(newCart) }
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== productId)
      return { cart: newCart, total: computeTotal(newCart) }
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const newCart =
        quantity <= 0
          ? state.cart.filter((item) => item.id !== productId)
          : state.cart.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            )
      return { cart: newCart, total: computeTotal(newCart) }
    }),

  applyDiscount: (productId, discount) =>
    set((state) => {
      const newCart = state.cart.map((item) =>
        item.id === productId ? { ...item, discount } : item
      )
      return { cart: newCart, total: computeTotal(newCart) }
    }),

  clearCart: () => set({ cart: [], total: 0 }),

  setPaymentStatus: (status) => set({ paymentStatus: status }),

  setIsOnline: (online) => set({ isOnline: online }),
}))
