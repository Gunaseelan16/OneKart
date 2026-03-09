import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useToast } from '../ToastContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    showToast(`Removed ${name} from cart`);
  };

  const handleUpdateQuantity = (id: string, name: string, newQty: number) => {
    updateQuantity(id, newQty);
    if (newQty > 0) {
      showToast(`Updated ${name} quantity to ${newQty}`);
    }
  };

  const shipping = cart.length > 0 ? (cartTotal > 1000 ? 0 : 500) : 0;
  const total = cartTotal + shipping;

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight">Shopping Cart</h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-4 sm:p-6 rounded-[32px] border border-black/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                    >
                      <div className="w-full sm:w-24 h-48 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 truncate pr-4">{item.name}</h3>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                          <div className="text-right sm:hidden">
                            <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-start sm:space-x-4 mt-4 sm:mt-0">
                          <div className="flex items-center border border-black/5 rounded-xl p-1 bg-gray-50">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.name, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.name, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
                      </div>
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl shadow-black/5 sticky top-32">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-bold text-gray-900">
                      {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-black/5 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center group mb-4"
                >
                  Checkout
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/shop"
                  className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-black/5">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all inline-block shadow-xl shadow-black/10"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
