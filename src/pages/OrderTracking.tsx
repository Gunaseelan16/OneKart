import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronLeft, Bell, Loader2 } from 'lucide-react';
import { useToast } from '../ToastContext';
import { useUser } from '@clerk/clerk-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  items: OrderItem[];
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const { showToast } = useToast();
  const { user, isLoaded } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user && orderId) {
      fetchOrder();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, orderId, user]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/user/orders/${user?.id}/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      showToast('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { id: 1, status: 'Order Placed', icon: Package, completed: true, current: status === 'pending' },
      { id: 2, status: 'Processing', icon: Clock, completed: ['processing', 'shipped', 'delivered'].includes(status), current: status === 'processing' },
      { id: 3, status: 'Shipped', icon: Truck, completed: ['shipped', 'delivered'].includes(status), current: status === 'shipped' },
      { id: 4, status: 'Out for Delivery', icon: MapPin, completed: status === 'delivered', current: false },
      { id: 5, status: 'Delivered', icon: CheckCircle, completed: status === 'delivered', current: status === 'delivered' },
    ];
    return steps;
  };

  if (!isLoaded || loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  if (!user || !order) {
    return (
      <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-[40px] border border-black/5 shadow-sm">
            <Package size={48} className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <Link to="/profile" className="inline-block px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all">
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = getStatusSteps(order.status);

  const handleCancelOrder = async (reason: string) => {
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (response.ok) {
        showToast('Order cancelled successfully', 'success');
        fetchOrder();
      } else {
        showToast('Failed to cancel order', 'error');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast('Error cancelling order', 'error');
    }
  };

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const getProgress = () => {
    switch (order.status.toLowerCase()) {
      case 'placed': return 0;
      case 'processing': return 25;
      case 'shipped': return 50;
      case 'out for delivery': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <Link to="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Profile
          </Link>
          <div className="flex items-center gap-2 text-emerald-600 animate-pulse">
            <Bell size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Live Updates Active</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Order</h1>
              <p className="text-gray-500">Order ID: <span className="font-bold text-gray-900">#{order.id}</span></p>
            </div>
            <div className={`px-6 py-3 rounded-2xl font-bold text-sm ${order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>

          {/* Bike Animation */}
          {order.status !== 'Cancelled' && (
            <div className="relative h-20 mb-12 bg-gray-50 rounded-3xl p-4 flex items-center">
              <div className="absolute left-10 right-10 h-1 bg-gray-200 rounded-full">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress()}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <motion.div 
                className="absolute z-10"
                initial={{ left: '40px' }}
                animate={{ left: `calc(${getProgress()}% + 40px)` }}
                transition={{ duration: 1 }}
                style={{ transform: 'translateX(-50%)' }}
              >
                <div className="bg-white p-2 rounded-xl shadow-lg border border-black/5">
                  <Truck size={24} className="text-emerald-600" />
                </div>
              </motion.div>
              <div className="absolute left-10 w-2 h-2 bg-emerald-500 rounded-full" />
              <div className="absolute right-10 w-2 h-2 bg-gray-300 rounded-full" />
            </div>
          )}

          {/* Tracking Timeline */}
          <div className="relative space-y-12">
            {/* Vertical Line */}
            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gray-100" />

            {steps.map((step) => (
              <div key={step.id} className="relative flex items-start">
                <div className={`
                  relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500
                  ${step.completed ? 'bg-emerald-600 text-white' : 'bg-white text-gray-300 border border-gray-100'}
                  ${step.current ? 'ring-4 ring-emerald-100 scale-110' : ''}
                `}>
                  <step.icon size={22} />
                </div>
                
                <div className="ml-8 pt-1">
                  <h3 className={`font-bold transition-colors ${step.completed ? 'text-gray-900' : 'text-gray-300'}`}>
                    {step.status}
                  </h3>
                  {step.completed && (
                    <p className={`text-xs mt-1 ${step.current ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                      {step.id === 1 ? new Date(order.created_at).toLocaleString() : 'Completed'}
                    </p>
                  )}
                </div>

                {step.current && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Current
                    </span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Cancel Order Button */}
          {['Placed', 'Processing'].includes(order.status) && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <button 
                onClick={() => setShowCancelModal(true)}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
              >
                Cancel Order
              </button>
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-500 font-bold">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-600">₹{order.total_price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cancel Order</h3>
              <p className="text-gray-500 mb-6">Please tell us why you want to cancel this order.</p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Changed my mind",
                  "Found a better price elsewhere",
                  "Order taking too long",
                  "Incorrect items ordered",
                  "Other"
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setCancelReason(reason)}
                    className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all ${cancelReason === reason ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-gray-100 hover:border-emerald-600'}`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => {
                    handleCancelOrder(cancelReason);
                    setShowCancelModal(false);
                  }}
                  disabled={!cancelReason}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
