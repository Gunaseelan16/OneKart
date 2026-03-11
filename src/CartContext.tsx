import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './types';
import { useUser } from '@clerk/clerk-react';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  coupon: { code: string; discount: number } | null;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  discountedTotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded: isUserLoaded } = useUser();

  // Fetch cart from database on load or local storage for guests
  useEffect(() => {
    const fetchCart = async () => {
      if (isUserLoaded && user) {
        try {
          const response = await fetch(`/api/cart/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setCart(data);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (isUserLoaded && !user) {
        const savedCart = localStorage.getItem('guest_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [isUserLoaded, user]);

  // Save guest cart to local storage
  useEffect(() => {
    if (isUserLoaded && !user) {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
  }, [cart, user, isUserLoaded]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (user) {
      try {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId: product.id, quantity })
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        await fetch(`/api/cart/${user.id}/${productId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const newQuantity = Math.max(1, quantity);
    if (user) {
      try {
        await fetch('/api/cart/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId, quantity: newQuantity })
        });
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch(`/api/cart/${user.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = (code: string, discount: number) => {
    setCoupon({ code, discount });
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountedTotal = coupon 
    ? cartTotal * (1 - coupon.discount / 100) 
    : cartTotal;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartTotal,
      coupon,
      applyCoupon,
      removeCoupon,
      discountedTotal,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
