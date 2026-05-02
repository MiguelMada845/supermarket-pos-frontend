import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { CartItem as CartItemType } from '../store/useStore'
import { CartItem } from './CartItem'
import { Checkout } from './Checkout'
import { Receipt } from './Receipt'

interface ReceiptData {
  receiptId: string
  items: CartItemType[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
}

export function Cart() {
  const { cart, total, setPaymentStatus, clearCart } = useStore()
  const [showCheckout, setShowCheckout] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  // total already includes 10% tax; derive subtotal by reversing the tax
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 - item.discount / 100),
    0
  )
  const tax = subtotal * 0.1

  const handleOpenCheckout = () => {
    setPaymentStatus('idle')
    setShowCheckout(true)
  }

  const handleCheckoutClose = () => {
    setPaymentStatus('idle')
    setShowCheckout(false)
  }

  const handleCheckoutSuccess = (receiptId: string, paymentMethod: string) => {
    // Snapshot the cart BEFORE clearing it
    const snapshot: ReceiptData = {
      receiptId,
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
    }
    clearCart()
    setReceiptData(snapshot)
    setShowCheckout(false)
  }

  const handleReceiptClose = () => {
    setReceiptData(null)
    setPaymentStatus('idle')
  }

  return (
    <>
      <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm flex flex-col h-full">
        {/* Cart header */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Cart
            {cart.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                {cart.length}
              </span>
            )}
          </h2>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-4 opacity-40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add products to get started</p>
            </div>
          ) : (
            cart.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl space-y-2">
            <div className="flex justify-between text-base text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-300">
              <span>Total</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>

            {/* Proceed to Checkout button */}
            <button
              onClick={handleOpenCheckout}
              className="w-full mt-3 py-4 rounded-xl bg-blue-600 text-white text-lg font-bold
                hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <Checkout
          onClose={handleCheckoutClose}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Receipt modal */}
      {receiptData && (
        <Receipt
          receiptId={receiptData.receiptId}
          items={receiptData.items}
          subtotal={receiptData.subtotal}
          tax={receiptData.tax}
          total={receiptData.total}
          paymentMethod={receiptData.paymentMethod}
          onClose={handleReceiptClose}
        />
      )}
    </>
  )
}
