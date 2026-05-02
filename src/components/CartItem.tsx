import type { CartItem as CartItemType } from '../store/useStore'
import { useStore } from '../store/useStore'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, applyDiscount, removeFromCart } = useStore()

  const lineTotal = item.price * item.quantity * (1 - item.discount / 100)

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1)
  }

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, Number(e.target.value)))
    applyDiscount(item.id, value)
  }

  return (
    <div className="flex flex-col gap-2 py-4 border-b border-gray-200 last:border-b-0">
      {/* Name + category + remove */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-800 leading-tight truncate">
            {item.name}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
            {item.category}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="flex-shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          {/* Trash icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {/* Unit price */}
      <p className="text-sm text-gray-500">
        Unit price:{' '}
        <span className="font-medium text-gray-700">${item.price.toFixed(2)}</span>
      </p>

      {/* Quantity controls + discount */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Quantity */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-xl font-bold rounded-lg transition-colors cursor-pointer"
          >
            −
          </button>
          <span
            className="w-10 text-center text-lg font-semibold text-gray-800"
            aria-label={`Quantity: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            aria-label="Increase quantity"
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-xl font-bold rounded-lg transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Discount */}
        <label className="flex items-center gap-1.5 text-sm text-gray-600">
          <span>Discount&nbsp;%</span>
          <input
            type="number"
            min={0}
            max={100}
            value={item.discount}
            onChange={handleDiscountChange}
            aria-label={`Discount percentage for ${item.name}`}
            className="w-16 px-2 py-1 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-center"
          />
        </label>
      </div>

      {/* Line total */}
      <div className="flex justify-end">
        <p className="text-lg font-bold text-green-600">
          ${lineTotal.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
