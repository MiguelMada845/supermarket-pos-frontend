# Supermarket POS Frontend - Design

## Tech Stack

* React + TypeScript
* Vite
* Zustand (state management)
* TailwindCSS (UI)
* Axios (API calls)

---

## Architecture

### Components

* ProductSearch
* BarcodeScanner
* Cart
* CartItem
* Checkout
* Receipt
* Header

---

## State Management

Global state using Zustand:

* products
* cart
* total
* paymentStatus

---

## Data Flow

1. User searches product → API call → results displayed
2. User adds product → stored in cart state
3. Cart updates totals in real-time
4. Checkout processes payment
5. Receipt generated

---

## API Endpoints

* GET /products
* GET /products?search=
* POST /checkout

---

## Offline Strategy

* Cache products in localStorage
* Use cached data when offline

---

## UI/UX Considerations

* Fast response (<500ms)
* Simple cashier interface
* Large buttons for usability
