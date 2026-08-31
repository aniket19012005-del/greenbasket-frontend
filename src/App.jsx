import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { NotFound } from './components/common/States';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import VendorLayout from './layouts/VendorLayout';
import DeliveryLayout from './layouts/DeliveryLayout';

// Auth pages
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';

// Customer pages
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import Categories from './pages/customer/Categories';
import ProductDetail from './pages/customer/ProductDetail';
import Vendors from './pages/customer/Vendors';
import VendorDetail from './pages/customer/VendorDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import Wishlist from './pages/customer/Wishlist';
import Profile from './pages/customer/Profile';
import Addresses from './pages/customer/Addresses';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/Categories';
import AdminVendors from './pages/admin/Vendors';
import AdminCustomers from './pages/admin/Customers';
import AdminDeliveryBoys from './pages/admin/DeliveryBoys';
import AdminCoupons from './pages/admin/Coupons';
import AdminPayments from './pages/admin/Payments';
import AdminPayouts from './pages/admin/Payouts';
import AdminReviews from './pages/admin/Reviews';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';

// Vendor pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorProductForm from './pages/vendor/ProductForm';
import VendorOrders from './pages/vendor/Orders';
import VendorInventory from './pages/vendor/Inventory';
import VendorEarnings from './pages/vendor/Earnings';
import VendorStore from './pages/vendor/Store';
import VendorReviews from './pages/vendor/Reviews';
import VendorSettings from './pages/vendor/Settings';

// Delivery pages
import DeliveryDashboard from './pages/delivery/Dashboard';
import DeliveryAssignments from './pages/delivery/Assignments';
import DeliveryActive from './pages/delivery/Active';
import DeliveryHistory from './pages/delivery/History';
import DeliveryEarnings from './pages/delivery/Earnings';
import DeliveryProfile from './pages/delivery/Profile';

export default function App() {
  return (
    <Routes>
      {/* Public + Customer */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendor/:id" element={<VendorDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute role="customer"><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="customer"><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute role="customer"><OrderDetail /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<ProtectedRoute role={['customer', 'admin', 'vendor', 'delivery_boy']}><Profile /></ProtectedRoute>} />
        <Route path="/addresses" element={<ProtectedRoute role="customer"><Addresses /></ProtectedRoute>} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="delivery-boys" element={<AdminDeliveryBoys />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="payouts" element={<AdminPayouts />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Vendor */}
      <Route path="/vendor" element={<ProtectedRoute role="vendor"><VendorLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="products/new" element={<VendorProductForm />} />
        <Route path="products/:id/edit" element={<VendorProductForm />} />
        <Route path="orders" element={<VendorOrders />} />
        <Route path="inventory" element={<VendorInventory />} />
        <Route path="earnings" element={<VendorEarnings />} />
        <Route path="store" element={<VendorStore />} />
        <Route path="reviews" element={<VendorReviews />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>

      {/* Delivery */}
      <Route path="/delivery" element={<ProtectedRoute role="delivery_boy"><DeliveryLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="assignments" element={<DeliveryAssignments />} />
        <Route path="active" element={<DeliveryActive />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="earnings" element={<DeliveryEarnings />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
