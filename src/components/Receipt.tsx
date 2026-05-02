import type { CartItem } from '../store/useStore'

interface ReceiptProps {
  receiptId: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  onClose: () => void
}

function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function generateTextReceipt(props: Omit<ReceiptProps, 'onClose'>): string {
  const { receiptId, items, subtotal, tax, total, paymentMethod } = props
  const dateStr = formatDate(new Date())
  const SEP = '---------------------------'
  const BORDER = '==========================='

  const lines: string[] = [
    BORDER,
    '     SUPERMARKET POS',
    BORDER,
    `Receipt: #${receiptId}`,
    `Date: ${dateStr}`,
    SEP,
  ]

  for (const item of items) {
    const lineTotal = item.price * item.quantity * (1 - item.discount / 100)
    const itemLabel = `${item.name} x${item.quantity}`
    const priceLabel = `$${(item.price * item.quantity).toFixed(2)}`
    lines.push(`${itemLabel.padEnd(17)}${priceLabel}`)
    if (item.discount > 0) {
      lines.push(`  Discount: ${item.discount}%`)
      lines.push(`  Line total: $${lineTotal.toFixed(2)}`)
    }
  }

  lines.push(
    SEP,
    `Subtotal:        $${subtotal.toFixed(2)}`,
    `Tax (10%):       $${tax.toFixed(2)}`,
    `TOTAL:           $${total.toFixed(2)}`,
    `Payment: ${paymentMethod}`,
    BORDER,
    'Thank you for your purchase!',
    BORDER
  )

  return lines.join('\n')
}

export function Receipt({
  receiptId,
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
  onClose,
}: ReceiptProps) {
  const dateStr = formatDate(new Date())

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const text = generateTextReceipt({ receiptId, items, subtotal, tax, total, paymentMethod })
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${receiptId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between print:hidden">
          <h2 id="receipt-title" className="text-xl font-bold text-gray-800">
            Receipt
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close receipt"
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

        {/* Receipt body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 font-mono text-sm">
          {/* Store name */}
          <div className="text-center mb-4">
            <p className="text-lg font-bold tracking-widest uppercase">Supermarket POS</p>
            <div className="border-t-2 border-dashed border-gray-300 mt-2" />
          </div>

          {/* Meta */}
          <div className="mb-4 space-y-1 text-gray-600">
            <div className="flex justify-between">
              <span className="font-semibold">Receipt:</span>
              <span>#{receiptId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{dateStr}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 mb-4" />

          {/* Items */}
          <div className="space-y-3 mb-4">
            {items.map((item) => {
              const lineTotal = item.price * item.quantity * (1 - item.discount / 100)
              return (
                <div key={item.id}>
                  <div className="flex justify-between text-gray-800">
                    <span className="font-medium">
                      {item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs pl-2">
                    <span>Unit price: ${item.price.toFixed(2)}</span>
                  </div>
                  {item.discount > 0 && (
                    <div className="pl-2 text-xs text-orange-600 space-y-0.5">
                      <div>Discount: {item.discount}%</div>
                      <div className="flex justify-between text-gray-700 font-medium">
                        <span>Line total:</span>
                        <span>${lineTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="border-t border-dashed border-gray-300 mb-4" />

          {/* Totals */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-1 border-t border-gray-300">
              <span>TOTAL</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="flex justify-between text-gray-600 mb-4">
            <span className="font-semibold">Payment</span>
            <span>{paymentMethod}</span>
          </div>

          <div className="border-t-2 border-dashed border-gray-300 mb-4" />

          <p className="text-center text-gray-500 text-xs tracking-wide">
            Thank you for your purchase!
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-semibold text-sm
              hover:bg-gray-900 active:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
              />
            </svg>
            Print
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm
              hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Download
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm
              hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
