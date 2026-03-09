import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronLeft, Bell } from 'lucide-react';
import { useToast } from '../ToastContext';

const TRACKING_STEPS = [
  { id: 1, status: 'Order Placed', date: 'Oct 24, 2024, 10:30 AM', icon: Package, completed: true, current: false },
  { id: 2, status: 'Processing', date: 'Oct 24, 2024, 02:15 PM', icon: Clock, completed: true, current: false },
  { id: 3, status: 'Shipped', date: 'Oct 25, 2024, 09:00 AM', icon: Truck, completed: true, current: true },
  { id: 4, status: 'Out for Delivery', date: 'Expected today', icon: MapPin, completed: false, current: false },
  { id: 5, status: 'Delivered', date: 'Expected today', icon: CheckCircle, completed: false, current: false },
];

export default function OrderTracking() {
  const { orderId } = useParams();
  const { showToast } = useToast();

  useEffect(() => {
    // Simulate a live notification after 5 seconds
    const timer = setTimeout(() => {
      showToast('Package has arrived at the local distribution center!', 'success');
    }, 5000);

    return () => clearTimeout(timer);
  }, [showToast]);

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
          className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Order</h1>
              <p className="text-gray-500">Order ID: <span className="font-bold text-gray-900">#{orderId}</span></p>
            </div>
            <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm">
              Estimated Delivery: Today, 5:00 PM
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative space-y-12">
            {/* Vertical Line */}
            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gray-100" />

            {TRACKING_STEPS.map((step, index) => (
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
                  <p className={`text-xs mt-1 ${step.current ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                    {step.date}
                  </p>
                </div>

                {step.current && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Live
                    </span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="mt-16 relative h-64 rounded-[32px] overflow-hidden bg-gray-100 border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000"
              alt="Tracking Map"
              className="w-full h-full object-cover opacity-50 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl border border-white/20 text-center">
                <MapPin className="mx-auto text-emerald-600 mb-2" />
                <p className="text-sm font-bold text-gray-900">Package is near Digital City Hub</p>
                <p className="text-xs text-gray-500">Last updated 5 mins ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
