import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, ArrowLeft, Shield, Truck, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useToast } from '../ToastContext';
import { cn } from '../utils';
import { useUser } from '@clerk/clerk-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchProduct();
    checkWishlist();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/reviews/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      showToast("Please sign in to comment");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          userId: user.id,
          userName: user.fullName || user.username,
          rating: 5,
          comment: newComment
        })
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
        showToast("Comment added!");
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const allProducts = await response.json();
        const related = allProducts
          .filter((p: any) => p.category === product.category && p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

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

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    window.location.href = '/cart';
  };

  const checkWishlist = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/user/wishlist/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsWishlisted(data.some((item: any) => item.id === id));
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      showToast("Please sign in to save items");
      return;
    }

    const method = isWishlisted ? 'DELETE' : 'POST';
    const url = isWishlisted 
      ? `/api/user/wishlist/${user.id}/${id}` 
      : '/api/user/wishlist';
      
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ userId: user.id, productId: id }) : undefined,
      });

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
      } else {
        throw new Error('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showToast("Failed to update wishlist");
    }
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
              {product.description}
            </p>

            {/* Store Info */}
            <div className="mb-8 p-6 bg-gray-50 rounded-3xl border border-black/5">
              <div className="flex items-center gap-4 mb-4">
                <img src={product.store_logo} alt={product.store_name} className="w-12 h-12 rounded-xl object-cover border border-black/5" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-gray-900">{product.store_name}</h4>
                  <p className="text-xs text-gray-500">Partner since {new Date(product.tie_up_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <Shield size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Verified Store</span>
              </div>
            </div>

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
                    className="flex-1 py-4 border-2 border-black text-black rounded-2xl font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center group"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center group"
                  >
                    Buy Now
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

        {/* Comments Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-10">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 rounded-[40px] border border-black/5 sticky top-32">
                <h3 className="text-xl font-bold mb-4">Add a Review</h3>
                <p className="text-gray-500 text-sm mb-6">Share your experience with this product.</p>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What do you think about this product?"
                  className="w-full p-4 bg-white border border-black/5 rounded-2xl h-32 focus:outline-none focus:border-emerald-600 transition-all mb-4"
                />
                <button
                  onClick={handleAddComment}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all"
                >
                  Post Review
                </button>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-8">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="p-8 bg-white border border-black/5 rounded-[40px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                          {comment.user_name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{comment.user_name}</h4>
                          <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill={s <= comment.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-10">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4 border border-black/5">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                  <p className="text-emerald-600 font-bold">₹{p.price.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
