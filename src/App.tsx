import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
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
import StoreDashboard from './pages/StoreDashboard';
import Stores from './pages/Stores';
import StoreProfile from './pages/StoreProfile';
import CreateStore from './pages/CreateStore';
import NotFound from './pages/NotFound';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider } from './CartContext';
import { ToastProvider, useToast } from './ToastContext';
import { useUser, SignOutButton } from '@clerk/clerk-react';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { showToast } = useToast();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (userEmail !== adminEmail) {
        showToast("You are not authorized to access this dashboard.", "error");
      }
    }
  }, [isLoaded, isSignedIn, user, adminEmail, showToast]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  if (userEmail !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </CartProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStoreDashboardRoute = location.pathname.startsWith('/store');
  const isAuthRoute = location.pathname.startsWith('/auth');
  const isDashboardRoute = isAdminRoute || isStoreDashboardRoute || isAuthRoute;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/store" element={<Navigate to="/store/dashboard" replace />} />
            <Route 
              path="/store/dashboard" 
              element={
                <ProtectedRoute>
                  <StoreDashboard />
                </ProtectedRoute>
              } 
            />
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
