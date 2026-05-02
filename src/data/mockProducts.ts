import type { Product } from '../store/useStore'

export interface MockProduct extends Product {
  stock: number
}

export const mockProducts: MockProduct[] = [
  // Fruits
  { id: 'p001', name: 'Apple', category: 'Fruits', price: 0.99, barcode: '1000000001', stock: 150 },
  { id: 'p002', name: 'Banana', category: 'Fruits', price: 0.49, barcode: '1000000002', stock: 200 },
  { id: 'p003', name: 'Orange', category: 'Fruits', price: 1.29, barcode: '1000000003', stock: 120 },
  { id: 'p004', name: 'Grapes', category: 'Fruits', price: 2.49, barcode: '1000000004', stock: 80 },
  { id: 'p005', name: 'Strawberry', category: 'Fruits', price: 3.99, barcode: '1000000005', stock: 60 },
  { id: 'p006', name: 'Watermelon', category: 'Fruits', price: 5.99, barcode: '1000000006', stock: 30 },
  { id: 'p007', name: 'Mango', category: 'Fruits', price: 1.79, barcode: '1000000007', stock: 90 },
  { id: 'p008', name: 'Pineapple', category: 'Fruits', price: 2.99, barcode: '1000000008', stock: 45 },

  // Vegetables
  { id: 'p009', name: 'Carrot', category: 'Vegetables', price: 0.79, barcode: '1000000009', stock: 180 },
  { id: 'p010', name: 'Broccoli', category: 'Vegetables', price: 1.49, barcode: '1000000010', stock: 100 },
  { id: 'p011', name: 'Tomato', category: 'Vegetables', price: 0.89, barcode: '1000000011', stock: 160 },
  { id: 'p012', name: 'Potato', category: 'Vegetables', price: 0.59, barcode: '1000000012', stock: 250 },
  { id: 'p013', name: 'Onion', category: 'Vegetables', price: 0.69, barcode: '1000000013', stock: 200 },
  { id: 'p014', name: 'Spinach', category: 'Vegetables', price: 1.99, barcode: '1000000014', stock: 75 },
  { id: 'p015', name: 'Cucumber', category: 'Vegetables', price: 0.99, barcode: '1000000015', stock: 110 },
  { id: 'p016', name: 'Bell Pepper', category: 'Vegetables', price: 1.29, barcode: '1000000016', stock: 90 },

  // Dairy
  { id: 'p017', name: 'Whole Milk (1L)', category: 'Dairy', price: 1.49, barcode: '1000000017', stock: 120 },
  { id: 'p018', name: 'Cheddar Cheese', category: 'Dairy', price: 3.99, barcode: '1000000018', stock: 60 },
  { id: 'p019', name: 'Butter (250g)', category: 'Dairy', price: 2.49, barcode: '1000000019', stock: 80 },
  { id: 'p020', name: 'Greek Yogurt', category: 'Dairy', price: 1.99, barcode: '1000000020', stock: 95 },
  { id: 'p021', name: 'Cream Cheese', category: 'Dairy', price: 2.29, barcode: '1000000021', stock: 55 },
  { id: 'p022', name: 'Sour Cream', category: 'Dairy', price: 1.79, barcode: '1000000022', stock: 70 },

  // Bakery
  { id: 'p023', name: 'White Bread', category: 'Bakery', price: 2.49, barcode: '1000000023', stock: 50 },
  { id: 'p024', name: 'Whole Wheat Bread', category: 'Bakery', price: 2.99, barcode: '1000000024', stock: 45 },
  { id: 'p025', name: 'Croissant', category: 'Bakery', price: 1.29, barcode: '1000000025', stock: 40 },
  { id: 'p026', name: 'Bagel', category: 'Bakery', price: 0.99, barcode: '1000000026', stock: 60 },
  { id: 'p027', name: 'Muffin', category: 'Bakery', price: 1.49, barcode: '1000000027', stock: 35 },
  { id: 'p028', name: 'Sourdough Loaf', category: 'Bakery', price: 4.99, barcode: '1000000028', stock: 20 },

  // Meat
  { id: 'p029', name: 'Chicken Breast (500g)', category: 'Meat', price: 5.99, barcode: '1000000029', stock: 40 },
  { id: 'p030', name: 'Ground Beef (500g)', category: 'Meat', price: 6.49, barcode: '1000000030', stock: 35 },
  { id: 'p031', name: 'Pork Chops (500g)', category: 'Meat', price: 5.49, barcode: '1000000031', stock: 30 },
  { id: 'p032', name: 'Salmon Fillet (300g)', category: 'Meat', price: 8.99, barcode: '1000000032', stock: 25 },
  { id: 'p033', name: 'Turkey Slices (200g)', category: 'Meat', price: 3.99, barcode: '1000000033', stock: 50 },
  { id: 'p034', name: 'Beef Steak (300g)', category: 'Meat', price: 9.99, barcode: '1000000034', stock: 20 },

  // Beverages
  { id: 'p035', name: 'Orange Juice (1L)', category: 'Beverages', price: 2.99, barcode: '1000000035', stock: 80 },
  { id: 'p036', name: 'Sparkling Water (1.5L)', category: 'Beverages', price: 1.29, barcode: '1000000036', stock: 100 },
  { id: 'p037', name: 'Cola (2L)', category: 'Beverages', price: 1.99, barcode: '1000000037', stock: 90 },
  { id: 'p038', name: 'Green Tea (500ml)', category: 'Beverages', price: 1.49, barcode: '1000000038', stock: 70 },
  { id: 'p039', name: 'Coffee (250g)', category: 'Beverages', price: 5.99, barcode: '1000000039', stock: 55 },
  { id: 'p040', name: 'Apple Juice (1L)', category: 'Beverages', price: 2.49, barcode: '1000000040', stock: 75 },

  // Other
  { id: 'p041', name: 'Pasta (500g)', category: 'Other', price: 1.49, barcode: '1000000041', stock: 120 },
  { id: 'p042', name: 'Rice (1kg)', category: 'Other', price: 2.99, barcode: '1000000042', stock: 100 },
  { id: 'p043', name: 'Olive Oil (500ml)', category: 'Other', price: 6.99, barcode: '1000000043', stock: 45 },
  { id: 'p044', name: 'Tomato Sauce (400g)', category: 'Other', price: 1.79, barcode: '1000000044', stock: 90 },
  { id: 'p045', name: 'Cornflakes (500g)', category: 'Other', price: 3.49, barcode: '1000000045', stock: 60 },
  { id: 'p046', name: 'Dark Chocolate (100g)', category: 'Other', price: 2.49, barcode: '1000000046', stock: 80 },
  { id: 'p047', name: 'Peanut Butter (340g)', category: 'Other', price: 3.99, barcode: '1000000047', stock: 55 },
  { id: 'p048', name: 'Honey (500g)', category: 'Other', price: 4.99, barcode: '1000000048', stock: 40 },
]
