import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { cn } from '../utils';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useToast } from '../ToastContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/user/wishlist/${user.id}`);
        if (response.ok) {
          const wishlist = await response.json();
          setIsWishlisted(wishlist.some((item: any) => item.id === product.id));
        }
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };
    checkWishlist();
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    showToast(`Added ${product.name} to cart!`);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please sign in to save items");
      return;
    }

    const method = isWishlisted ? 'DELETE' : 'POST';
    const url = isWishlisted 
      ? `/api/user/wishlist/${user.id}/${product.id}` 
      : '/api/user/wishlist';
      
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ userId: user.id, productId: product.id }) : undefined,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          bounce: 0.4,
          duration: 0.8
        }
      }}
      viewport={{ once: false, margin: "-50px" }}
      whileHover={{ 
        y: -15,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-600/20">
            New
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/20">
            Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={toggleWishlist}
        className={cn(
          "absolute top-4 right-4 z-10 p-2 backdrop-blur-sm rounded-full transition-all shadow-sm",
          isWishlisted 
            ? "bg-red-500 text-white opacity-100" 
            : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 lg:opacity-0 lg:group-hover:opacity-100"
        )}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="aspect-[4/5] overflow-hidden bg-gray-100 block">
        <img
          src={product.image_url || product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            {product.category}
          </span>
          <div className="flex items-center text-amber-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold ml-1 text-gray-600">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[10px] text-gray-400">by</span>
          <Link to={`/store/${product.brand}`} className="text-[10px] font-bold text-gray-900 hover:text-emerald-600 transition-colors uppercase tracking-widest">
            {product.brand}
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-black/10"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
