import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import AdminStoreDetails from './pages/AdminStoreDetails';
import StoreDashboard from './pages/StoreDashboard';
import Stores from './pages/Stores';
import StoreProfile from './pages/StoreProfile';
import CreateStore from './pages/CreateStore';
import NotFound from './pages/NotFound';
import { AnimatePresence } from 'motion/react';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';
import { Toaster } from 'react-hot-toast';
import { Lock } from 'lucide-react';

import { ClerkProvider, SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
const IS_CLERK_KEY_VALID = CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_') || CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_');

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Clerk Publishable Key is missing.");
} else if (!IS_CLERK_KEY_VALID) {
  console.error("Invalid Clerk Publishable Key format. It should start with 'pk_test_' or 'pk_live_'.");
}

function UserSync() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  React.useEffect(() => {
    const sync = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          await fetch('/api/user/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              fullName: user.fullName
            })
          });
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };
    sync();
  }, [isLoaded, user]);

  return null;
}

export default function App() {
  const content = (
    <CartProvider>
      <ToastProvider>
        <Router>
          <UserSync />
          <AppContent />
        </Router>
      </ToastProvider>
    </CartProvider>
  );

  if (!CLERK_PUBLISHABLE_KEY || !IS_CLERK_KEY_VALID) {
    return content;
  }

  return (
    <ClerkProvider key={CLERK_PUBLISHABLE_KEY} publishableKey={CLERK_PUBLISHABLE_KEY}>
      {content}
    </ClerkProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStoreDashboardRoute = location.pathname.startsWith('/store');
  const isDashboardRoute = isAdminRoute || isStoreDashboardRoute;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="top-center" reverseOrder={false} />
      {!isDashboardRoute && <Navbar />}
      
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/store/:brandName" element={<StoreProfile />} />
            <Route path="/create-store" element={<CreateStore />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/store/:id" element={<AdminStoreDetails />} />
            <Route path="/store" element={<Navigate to="/store/dashboard" replace />} />
            <Route path="/store/dashboard" element={<StoreDashboard />} />
            {/* Redirects for old routes */}
            <Route path="/sellers" element={<Navigate to="/stores" replace />} />
            <Route path="/seller" element={<Navigate to="/store/dashboard" replace />} />
            <Route path="/seller/dashboard" element={<Navigate to="/store/dashboard" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isDashboardRoute && <Footer />}
    </div>
  );
}
