import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function Wishlist() {
  const { user, isLoaded } = useUser();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isLoaded && user) {
      fetchWishlist();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/user/wishlist/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/user/wishlist/${user.id}/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlist(items => items.filter(item => item.id !== productId));
        toast.success('Removed from wishlist');
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-white p-12 rounded-[40px] border border-black/5 shadow-sm">
            <Heart size={48} className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold mb-4">Please sign in to view your wishlist</h2>
            <Link to="/auth" className="inline-block px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      referrerPolicy="no-referrer" 
                    />
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
                        onClick={() => addToCart({ ...item, id: item.id } as any)}
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
