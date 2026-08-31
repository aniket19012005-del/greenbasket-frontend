// Realistic seed/mock data used only as a development fallback when the
// GreenBasket backend API is unreachable. Every service function in
// src/services tries the real API first and falls back to this data.
// Replace/remove this file once the backend is fully wired up.

export const categories = [
  { id: 'cat-leafy', name: 'Leafy Greens', emoji: '🥬', productCount: 18 },
  { id: 'cat-root', name: 'Root Vegetables', emoji: '🥕', productCount: 24 },
  { id: 'cat-fresh', name: 'Fresh Vegetables', emoji: '🍅', productCount: 32 },
  { id: 'cat-herbs', name: 'Herbs & Spices', emoji: '🌿', productCount: 15 },
  { id: 'cat-organic', name: 'Organic', emoji: '🌱', productCount: 21 },
  { id: 'cat-seasonal', name: 'Seasonal', emoji: '🎃', productCount: 12 },
];

export const vendors = [
  {
    id: 'v1', name: 'FreshFarm', owner: 'Ramesh Gupta', email: 'ramesh@freshfarm.in', phone: '+91 98100 22334',
    rating: 4.7, status: 'approved', logo: '🧺', cover: 'farm', deliveryInfo: '30–45 min delivery • Free above ₹399',
    about: 'FreshFarm has been supplying pesticide-light produce straight from Sonipat farms since 2016.',
    address: 'Sector 12, Sonipat, Haryana', serviceAreas: ['Sonipat', 'Rohini', 'North Delhi'],
    products: 42, orders: 1280, sales: 486200, commission: 12,
  },
  {
    id: 'v2', name: 'GreenVeg Co.', owner: 'Anita Sharma', email: 'anita@greenveg.in', phone: '+91 98200 11223',
    rating: 4.5, status: 'approved', logo: '🥦', cover: 'greens',
    deliveryInfo: '40–60 min delivery • Free above ₹499',
    about: 'A collective of 40 smallholder farmers around Nashik bringing you seasonal veggies at fair prices.',
    address: 'MIDC Road, Nashik, Maharashtra', serviceAreas: ['Nashik', 'Pune Outskirts'],
    products: 36, orders: 940, sales: 312500, commission: 10,
  },
  {
    id: 'v3', name: 'Organic Roots', owner: 'Vikram Singh', email: 'vikram@organicroots.in', phone: '+91 90210 55667',
    rating: 4.8, status: 'pending', logo: '🌾', cover: 'organic',
    deliveryInfo: '1–2 hr delivery • Free above ₹599',
    about: 'Certified organic root vegetables and herbs grown without synthetic fertilizers.',
    address: 'Kundli, Haryana', serviceAreas: ['Kundli', 'North Delhi'],
    products: 19, orders: 210, sales: 88900, commission: 14,
  },
];

const img = (seed) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=600&q=70`;

export const products = [
  { id: 'p1', name: 'Fresh Tomato', vendorId: 'v1', vendorName: 'FreshFarm', categoryId: 'cat-fresh', unit: 'kg', price: 45, originalPrice: 55, stock: 120, rating: 4.6, organic: false, featured: true, images: [img('photo-1546470427-e26264be0b0d')], description: 'Juicy, vine-ripened tomatoes hand-picked at peak freshness. Great for curries, salads and chutneys.' },
  { id: 'p2', name: 'Baby Potato', vendorId: 'v1', vendorName: 'FreshFarm', categoryId: 'cat-root', unit: 'kg', price: 38, originalPrice: 42, stock: 90, rating: 4.4, organic: false, featured: false, images: [img('photo-1518977676601-b53f82aba655')], description: 'Small, tender potatoes ideal for roasting and curries. Thin-skinned and quick to cook.' },
  { id: 'p3', name: 'Red Onion', vendorId: 'v2', vendorName: 'GreenVeg Co.', categoryId: 'cat-root', unit: 'kg', price: 32, originalPrice: 32, stock: 6, rating: 4.3, organic: false, featured: false, images: [img('photo-1618512496248-a07fe83aa8cb')], description: 'Sharp, flavourful red onions sourced from Nashik — the onion capital of India.' },
  { id: 'p4', name: 'Carrot', vendorId: 'v2', vendorName: 'GreenVeg Co.', categoryId: 'cat-root', unit: 'kg', price: 40, originalPrice: 48, stock: 75, rating: 4.5, organic: false, featured: true, images: [img('photo-1447175008436-054170c2e979')], description: 'Crunchy, sweet carrots — great raw, juiced or cooked into halwa.' },
  { id: 'p5', name: 'Spinach (Palak)', vendorId: 'v1', vendorName: 'FreshFarm', categoryId: 'cat-leafy', unit: 'bunch', price: 18, originalPrice: 22, stock: 0, rating: 4.2, organic: true, featured: false, images: [img('photo-1576045057995-568f588f82fb')], description: 'Tender spinach leaves, washed and ready to cook. Rich in iron.' },
  { id: 'p6', name: 'Coriander Leaves', vendorId: 'v2', vendorName: 'GreenVeg Co.', categoryId: 'cat-herbs', unit: 'bunch', price: 10, originalPrice: 12, stock: 200, rating: 4.7, organic: false, featured: false, images: [img('photo-1615485500704-8e990f9900f7')], description: 'Fragrant coriander to finish any dish. Freshly cut every morning.' },
  { id: 'p7', name: 'Capsicum (Green)', vendorId: 'v1', vendorName: 'FreshFarm', categoryId: 'cat-fresh', unit: 'kg', price: 55, originalPrice: 65, stock: 40, rating: 4.4, organic: false, featured: true, images: [img('photo-1563565375-f3fdfdbefa83')], description: 'Crisp green capsicum, perfect for stir-fries and stuffed sabzis.' },
  { id: 'p8', name: 'Organic Beetroot', vendorId: 'v3', vendorName: 'Organic Roots', categoryId: 'cat-organic', unit: 'kg', price: 60, originalPrice: 70, stock: 30, rating: 4.9, organic: true, featured: true, images: [img('photo-1593105544559-ecb03bf76f82')], description: 'Certified organic beetroot, naturally sweet and packed with nutrients.' },
  { id: 'p9', name: 'Cauliflower', vendorId: 'v2', vendorName: 'GreenVeg Co.', categoryId: 'cat-seasonal', unit: 'piece', price: 28, originalPrice: 32, stock: 55, rating: 4.1, organic: false, featured: false, images: [img('photo-1568584711271-e837a5e42d43')], description: 'Firm, white cauliflower heads — a winter seasonal favourite.' },
  { id: 'p10', name: 'Ginger', vendorId: 'v3', vendorName: 'Organic Roots', categoryId: 'cat-herbs', unit: '250g', price: 25, originalPrice: 30, stock: 88, rating: 4.6, organic: true, featured: false, images: [img('photo-1615485291234-2a3a9b0bf6b0')], description: 'Aromatic, fibre-free ginger for tea, curries and chutneys.' },
  { id: 'p11', name: 'Cucumber', vendorId: 'v1', vendorName: 'FreshFarm', categoryId: 'cat-fresh', unit: 'kg', price: 30, originalPrice: 35, stock: 65, rating: 4.3, organic: false, featured: false, images: [img('photo-1449300079323-02e209d9d3a6')], description: 'Cool, crunchy cucumbers — great for salads and raita.' },
  { id: 'p12', name: 'Green Chilli', vendorId: 'v2', vendorName: 'GreenVeg Co.', categoryId: 'cat-herbs', unit: '100g', price: 8, originalPrice: 10, stock: 150, rating: 4.5, organic: false, featured: false, images: [img('photo-1583119022894-919a68a3d0e3')], description: 'Fiery green chillies to season any dish just right.' },
];

export const orders = [
  {
    id: 'ORD-10234', customerId: 'c1', customerName: 'Priya Verma', vendorId: 'v1', vendorName: 'FreshFarm',
    items: [ { productId: 'p1', name: 'Fresh Tomato', qty: 2, price: 45 }, { productId: 'p2', name: 'Baby Potato', qty: 1, price: 38 } ],
    amount: 128, paymentMethod: 'Razorpay', paymentStatus: 'paid', status: 'out_for_delivery',
    deliveryBoy: { id: 'd1', name: 'Suresh Kumar', phone: '+91 99887 66554' },
    address: '221B, Green Park, New Delhi - 110016', placedAt: '2026-08-29T08:10:00+05:30',
  },
  {
    id: 'ORD-10233', customerId: 'c2', customerName: 'Arjun Mehta', vendorId: 'v2', vendorName: 'GreenVeg Co.',
    items: [ { productId: 'p3', name: 'Red Onion', qty: 3, price: 32 }, { productId: 'p4', name: 'Carrot', qty: 1, price: 40 } ],
    amount: 136, paymentMethod: 'COD', paymentStatus: 'pending', status: 'preparing',
    deliveryBoy: null, address: '14, MG Road, Pune - 411001', placedAt: '2026-08-29T07:40:00+05:30',
  },
  {
    id: 'ORD-10232', customerId: 'c3', customerName: 'Sneha Iyer', vendorId: 'v1', vendorName: 'FreshFarm',
    items: [ { productId: 'p7', name: 'Capsicum (Green)', qty: 1, price: 55 } ],
    amount: 55, paymentMethod: 'Razorpay', paymentStatus: 'paid', status: 'delivered',
    deliveryBoy: { id: 'd2', name: 'Manoj Yadav', phone: '+91 91234 56780' },
    address: 'Flat 4B, Lake View Apts, Bengaluru - 560037', placedAt: '2026-08-28T18:20:00+05:30',
  },
  {
    id: 'ORD-10231', customerId: 'c1', customerName: 'Priya Verma', vendorId: 'v3', vendorName: 'Organic Roots',
    items: [ { productId: 'p8', name: 'Organic Beetroot', qty: 2, price: 60 } ],
    amount: 120, paymentMethod: 'Razorpay', paymentStatus: 'paid', status: 'confirmed',
    deliveryBoy: null, address: '221B, Green Park, New Delhi - 110016', placedAt: '2026-08-29T09:05:00+05:30',
  },
];

export const deliveryBoys = [
  { id: 'd1', name: 'Suresh Kumar', phone: '+91 99887 66554', vehicle: 'Bike', vehicleNumber: 'DL 4S AB 1234', status: 'approved', online: true, deliveries: 812, rating: 4.7, earnings: 48200 },
  { id: 'd2', name: 'Manoj Yadav', phone: '+91 91234 56780', vehicle: 'Bike', vehicleNumber: 'KA 03 CD 4521', status: 'approved', online: false, deliveries: 540, rating: 4.6, earnings: 32100 },
  { id: 'd3', name: 'Deepak Rana', phone: '+91 90000 12121', vehicle: 'Cycle', vehicleNumber: '—', status: 'pending', online: false, deliveries: 0, rating: 0, earnings: 0 },
];

export const customers = [
  { id: 'c1', name: 'Priya Verma', email: 'priya.verma@gmail.com', phone: '+91 98765 43210', orders: 14, totalSpent: 6840, status: 'active', joinedAt: '2025-11-02' },
  { id: 'c2', name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', phone: '+91 91122 33445', orders: 6, totalSpent: 2210, status: 'active', joinedAt: '2026-01-18' },
  { id: 'c3', name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com', phone: '+91 90909 80808', orders: 22, totalSpent: 11430, status: 'active', joinedAt: '2025-08-30' },
  { id: 'c4', name: 'Rahul Nair', email: 'rahul.nair@gmail.com', phone: '+91 88990 11223', orders: 1, totalSpent: 210, status: 'suspended', joinedAt: '2026-02-11' },
];

export const coupons = [
  { id: 'cp1', code: 'FRESH50', discountType: 'flat', discountValue: 50, minOrder: 300, maxDiscount: 50, expiry: '2026-09-30', usageLimit: 500, used: 214, active: true },
  { id: 'cp2', code: 'WELCOME10', discountType: 'percent', discountValue: 10, minOrder: 199, maxDiscount: 100, expiry: '2026-12-31', usageLimit: 2000, used: 890, active: true },
  { id: 'cp3', code: 'ORGANIC15', discountType: 'percent', discountValue: 15, minOrder: 499, maxDiscount: 150, expiry: '2026-06-30', usageLimit: 300, used: 300, active: false },
];

export const reviews = [
  { id: 'r1', productId: 'p1', productName: 'Fresh Tomato', vendorId: 'v1', customerName: 'Priya Verma', rating: 5, comment: 'Extremely fresh, delivered on time.', date: '2026-08-20' },
  { id: 'r2', productId: 'p8', productName: 'Organic Beetroot', vendorId: 'v3', customerName: 'Sneha Iyer', rating: 4, comment: 'Good quality but a bit pricey.', date: '2026-08-18' },
];

export const currentUserSeed = {
  addresses: [
    { id: 'a1', label: 'Home', line: '221B, Green Park', city: 'New Delhi', pincode: '110016', isDefault: true },
    { id: 'a2', label: 'Office', line: 'WeWork, Cyber Hub', city: 'Gurugram', pincode: '122002', isDefault: false },
  ],
  wishlist: ['p1', 'p8'],
};

export const salesTrend = [
  { label: 'Mon', revenue: 24000, orders: 62 },
  { label: 'Tue', revenue: 28500, orders: 71 },
  { label: 'Wed', revenue: 19800, orders: 54 },
  { label: 'Thu', revenue: 33200, orders: 88 },
  { label: 'Fri', revenue: 41000, orders: 103 },
  { label: 'Sat', revenue: 52300, orders: 132 },
  { label: 'Sun', revenue: 47100, orders: 118 },
];
