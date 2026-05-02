import { useState, useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { getProductByBarcode } from '../services/api'
import type { Product } from '../store/useStore'

// Extend the Window type to include BarcodeDetector
declare global {
  interface Window {
    BarcodeDetector: typeof BarcodeDetector
  }
  class BarcodeDetector {
    constructor(options?: { formats: string[] })
    detect(image: HTMLVideoElement | HTMLImageElement | ImageBitmap): Promise<Array<{ rawValue: string }>>
    static getSupportedFormats(): Promise<string[]>
  }
}

const isBarcodeDetectorSupported = (): boolean =>
  typeof window !== 'undefined' && 'BarcodeDetector' in window

export function BarcodeScanner() {
  const [manualInput, setManualInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<InstanceType<typeof BarcodeDetector> | null>(null)
  const scanLoopRef = useRef<number | null>(null)
  const lastScannedRef = useRef<string | null>(null)

  const { products, addToCart } = useStore()

  const supported = isBarcodeDetectorSupported()

  // Clear feedback messages after a delay
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setError(null)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const showError = (msg: string) => {
    setError(msg)
    setSuccessMessage(null)
  }

  // Find a product by barcode: check local store first, then try API silently.
  const resolveBarcode = useCallback(
    async (barcode: string): Promise<Product | null> => {
      // 1. Local lookup (always works, no network needed)
      const local = products.find((p) => p.barcode === barcode) ?? null
      if (local) return local

      // 2. API fallback — silent on failure (backend may not be running)
      try {
        return await getProductByBarcode(barcode)
      } catch {
        return null
      }
    },
    [products]
  )

  const lookupBarcode = useCallback(
    async (barcode: string) => {
      const trimmed = barcode.trim()
      if (!trimmed) return

      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      try {
        const product = await resolveBarcode(trimmed)
        if (product) {
          addToCart(product)
          showSuccess(`Added "${product.name}" to cart`)
        } else {
          showError(`Invalid barcode: ${trimmed}`)
        }
      } finally {
        setLoading(false)
      }
    },
    [resolveBarcode, addToCart]
  )

  const handleManualSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      lookupBarcode(manualInput)
      setManualInput('')
    }
  }

  const handleManualKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (manualInput.trim()) {
        lookupBarcode(manualInput)
        setManualInput('')
      }
    }
  }

  // Start camera and scanning loop
  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Initialise BarcodeDetector
      if (supported) {
        detectorRef.current = new window.BarcodeDetector({
          formats: [
            'ean_13',
            'ean_8',
            'upc_a',
            'upc_e',
            'code_128',
            'code_39',
            'qr_code',
          ],
        })
        setScanning(true)
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not access camera'
      setCameraError(`Camera error: ${msg}`)
      setCameraActive(false)
    }
  }, [supported])

  // Stop camera and scanning loop
  const stopCamera = useCallback(() => {
    if (scanLoopRef.current !== null) {
      cancelAnimationFrame(scanLoopRef.current)
      scanLoopRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    detectorRef.current = null
    lastScannedRef.current = null
    setScanning(false)
  }, [])

  // Toggle camera on/off
  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera()
      setCameraActive(false)
    } else {
      setCameraActive(true)
    }
  }

  // Start camera when cameraActive becomes true
  useEffect(() => {
    if (cameraActive) {
      startCamera()
    }
    return () => {
      if (!cameraActive) {
        stopCamera()
      }
    }
  }, [cameraActive, startCamera, stopCamera])

  // Scanning loop using requestAnimationFrame
  useEffect(() => {
    if (!scanning || !detectorRef.current || !videoRef.current) return

    let cancelled = false

    const scan = async () => {
      if (cancelled) return
      const video = videoRef.current
      const detector = detectorRef.current
      if (!video || !detector || video.readyState < 2) {
        scanLoopRef.current = requestAnimationFrame(scan)
        return
      }

      try {
        const barcodes = await detector.detect(video)
        if (barcodes.length > 0) {
          const value = barcodes[0].rawValue
          // Debounce: don't re-scan the same barcode immediately
          if (value !== lastScannedRef.current) {
            lastScannedRef.current = value
            await lookupBarcode(value)
            // Wait 2 seconds before allowing the same barcode again
            setTimeout(() => {
              lastScannedRef.current = null
            }, 2000)
          }
        }
      } catch {
        // Detection errors are non-fatal; keep looping
      }

      if (!cancelled) {
        scanLoopRef.current = requestAnimationFrame(scan)
      }
    }

    scanLoopRef.current = requestAnimationFrame(scan)

    return () => {
      cancelled = true
      if (scanLoopRef.current !== null) {
        cancelAnimationFrame(scanLoopRef.current)
        scanLoopRef.current = null
      }
    }
  }, [scanning, lookupBarcode])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Barcode Scanner</h2>

      {/* Manual input */}
      <form onSubmit={handleManualSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyDown={handleManualKeyDown}
          placeholder="Enter barcode..."
          aria-label="Enter barcode manually"
          disabled={loading}
          className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !manualInput.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-lg font-semibold rounded-xl transition-colors cursor-pointer"
          aria-label="Scan barcode"
        >
          {loading ? 'Looking up…' : 'Scan'}
        </button>
      </form>

      {/* Camera toggle button */}
      <button
        type="button"
        onClick={toggleCamera}
        disabled={!supported}
        className={`w-full py-3 px-4 text-lg font-semibold rounded-xl transition-colors cursor-pointer mb-4 ${
          cameraActive
            ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white disabled:opacity-50'
        }`}
        aria-label={cameraActive ? 'Stop camera' : 'Start camera'}
      >
        {cameraActive ? '⏹ Stop Camera' : '📷 Start Camera'}
      </button>

      {/* BarcodeDetector not supported fallback */}
      {!supported && (
        <div className="px-4 py-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm mb-4">
          Camera scanning is not supported in this browser. Please use manual input.
        </div>
      )}

      {/* Camera error */}
      {cameraError && (
        <div className="px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm mb-4">
          {cameraError}
        </div>
      )}

      {/* Live camera preview */}
      {cameraActive && (
        <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-gray-300 bg-black">
          <video
            ref={videoRef}
            muted
            playsInline
            className="w-full max-h-64 object-cover"
            aria-label="Camera preview"
          />
          {scanning && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
              Scanning…
            </div>
          )}
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="px-4 py-3 bg-green-100 border border-green-400 text-green-800 rounded-lg">
          ✓ {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
