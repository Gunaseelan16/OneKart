import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, ArrowLeft, Shield, Truck, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useToast } from '../ToastContext';
import { cn } from '../utils';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity} ${product.name} to cart!`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-emerald-600 font-bold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const mainImage = product.image_url || (product.image_urls && product.image_urls[0]) || product.image;
  const galleryImages = product.image_urls || [mainImage];

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-600 mb-10 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-3xl sm:rounded-[40px] overflow-hidden bg-gray-100 border border-black/5 shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {galleryImages.map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-black/5 cursor-pointer hover:border-emerald-600 transition-all">
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${i}`}
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6 sm:mb-8">
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 block">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill={s <= Math.floor(product.rating || 5) ? "currentColor" : "none"} />
                  ))}
                  <span className="text-sm font-bold ml-2 text-gray-900">{product.rating || 5}</span>
                </div>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <span className="text-sm text-gray-500 font-medium">{product.reviews || 0} Customer Reviews</span>
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
            </div>

            <p className="text-gray-600 mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base">
              {product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="space-y-6 mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center border border-black/10 rounded-2xl p-1 self-start sm:self-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-4 flex-1">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center group"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={toggleWishlist}
                    className={cn(
                      "p-4 border border-black/10 rounded-2xl transition-all",
                      isWishlisted ? "bg-red-500 border-red-500 text-white" : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
                    )}
                  >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-black/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Free Delivery</h4>
                  <p className="text-[10px] text-gray-500">Orders over ₹1,000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Secure Payment</h4>
                  <p className="text-[10px] text-gray-500">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Easy Returns</h4>
                  <p className="text-[10px] text-gray-500">30-Day Policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
