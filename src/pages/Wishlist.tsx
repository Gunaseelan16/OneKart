import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAMPLE_PRODUCTS } from '../constants';
import { useState } from 'react';
import { useCart } from '../CartContext';

export default function Wishlist() {
  // Mock wishlist items
  const [wishlist, setWishlist] = useState([
    SAMPLE_PRODUCTS[2],
    SAMPLE_PRODUCTS[5],
  ]);
  const { addToCart } = useCart();

  const removeFromWishlist = (id: string) => {
    setWishlist(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Wishlist</h1>
          <span className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-full border border-black/5">
            {wishlist.length} Items Saved
          </span>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{item.category}</span>
                      <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-4 truncate">{item.name}</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${item.id}`}
                        className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all"
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] border border-black/5">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to find them easily later.</p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all inline-block shadow-xl shadow-black/10"
            >
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
