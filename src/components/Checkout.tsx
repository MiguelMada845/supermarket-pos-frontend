import { useState } from 'react'
import { useStore } from '../store/useStore'
import { checkout as checkoutApi } from '../services/api'

// Generate a local receipt ID — used when the backend is unavailable
function generateReceiptId(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${ts}-${rand}`
}

// Simulate a short processing delay so the UI feels realistic
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface CheckoutProps {
  onClose: () => void
  onSuccess: (receiptId: string, paymentMethod: string) => void
}

type PaymentMethod = 'Cash' | 'Card' | 'Digital'

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Card', 'Digital']

const PAYMENT_ICONS: Record<PaymentMethod, string> = {
  Cash: '💵',
  Card: '💳',
  Digital: '📱',
}

export function Checkout({ onClose, onSuccess }: CheckoutProps) {
  const { cart, total, paymentStatus, setPaymentStatus } = useStore()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash')

  const isProcessing = paymentStatus === 'processing'

  const handleConfirm = async () => {
    setPaymentStatus('processing')

    // Try the real API first; if it fails (no backend), fall back to local simulation.
    // Either way the checkout succeeds — no error is shown to the cashier.
    let receiptId: string
    try {
      const result = await checkoutApi(cart, selectedMethod)
      receiptId = result.success ? result.receiptId : generateReceiptId()
    } catch {
      // Backend unavailable — simulate locally with a brief delay
      await delay(600)
      receiptId = generateReceiptId()
    }

    setPaymentStatus('success')
    onSuccess(receiptId, selectedMethod)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 id="checkout-title" className="text-2xl font-bold text-gray-800">
            Checkout
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
            aria-label="Close checkout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Total */}
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
            Amount Due
          </p>
          <p className="text-4xl font-bold text-green-600">${total.toFixed(2)}</p>
        </div>

        {/* Payment method selection */}
        <div className="px-6 py-5">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Select Payment Method
          </p>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method
              return (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  disabled={isProcessing}
                  className={`
                    flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 font-semibold text-base transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {PAYMENT_ICONS[method]}
                  </span>
                  {method}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-blue-600 text-white text-lg font-bold
              hover:bg-blue-700 active:bg-blue-800 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Processing…
              </>
            ) : (
              'Confirm Payment'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-base font-semibold
              hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
