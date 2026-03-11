import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, ArrowRight, CheckCircle2, MapPin, Wallet, Smartphone, Loader2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../utils';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export default function Checkout() {
  const { cart, cartTotal, clearCart, coupon, applyCoupon, removeCoupon, discountedTotal } = useCart();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'cod'>('card');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const shipping = discountedTotal > 1000 ? 0 : 500;
  const total = discountedTotal + shipping;

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        toast.error('Please sign in to checkout');
        navigate('/profile');
        return;
      }
      fetchAddresses();
    }
  }, [isLoaded, user]);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/user/addresses/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch addresses');
      const data = await response.json();
      setAddresses(data);
      const defaultAddr = data.find((a: Address) => a.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (data.length > 0) setSelectedAddressId(data[0].id);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });

      if (response.ok) {
        const data = await response.json();
        applyCoupon(data.code, data.discount);
        toast.success(`Coupon applied! ${data.discount}% discount`);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('Failed to validate coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'card') {
        const response = await fetch('/api/payment/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id || 'guest',
            cartItems: cart.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            })),
            addressId: selectedAddressId,
            totalPrice: total
          }),
        });

        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('Failed to create checkout session');
        }
      } else {
        // Handle COD or other methods
        const response = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id || 'guest',
            addressId: selectedAddressId,
            totalPrice: total,
            paymentMethod: paymentMethod.toUpperCase(),
            cartItems: cart.map(item => ({
              id: item.id,
              price: item.price,
              quantity: item.quantity
            }))
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setOrderId(data.orderId);
          setIsSuccess(true);
          clearCart();
          toast.success('Order placed successfully!');
        } else {
          throw new Error('Failed to place order');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    navigate('/shop');
    return null;
  }

  if (isSuccess) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[40px] text-center shadow-2xl shadow-black/5 border border-black/5"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-500 mb-10">
            Thank you for your purchase. Your order {orderId ? `#${orderId}` : ''} has been placed successfully and will be shipped soon.
          </p>
          <div className="space-y-4">
            <Link
              to={orderId ? `/order-tracking/${orderId}` : "/profile"}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all block text-center shadow-lg shadow-emerald-600/20"
            >
              Track Order
            </Link>
            <Link
              to="/shop"
              className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all block text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Steps */}
            <div className="flex items-center space-x-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                    step >= s ? "bg-emerald-600 text-white" : "bg-white text-gray-400 border border-black/5"
                  )}>
                    {s}
                  </div>
                  {s < 3 && <div className={cn("w-12 h-px mx-2", step > s ? "bg-emerald-600" : "bg-gray-200")}></div>}
                </div>
              ))}
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 sm:p-10 rounded-[40px] border border-black/5 shadow-sm">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                  <Truck size={24} className="mr-3 text-emerald-600" />
                  Shipping Address
                </h3>
                
                {loadingAddresses ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={cn(
                          "p-4 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer",
                          selectedAddressId === addr.id ? "border-emerald-600 bg-emerald-50/30" : "border-black/5 bg-gray-50 hover:bg-white hover:shadow-xl"
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <MapPin size={20} className="text-emerald-600" />
                          </div>
                          {selectedAddressId === addr.id && <div className="w-6 h-6 rounded-full border-4 border-emerald-600 bg-white"></div>}
                        </div>
                        <p className="font-bold text-gray-900 capitalize">{addr.type}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} {addr.zip_code}, {addr.country}
                        </p>
                      </div>
                    ))}

                    <Link to="/profile" className="p-4 sm:p-6 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-600 transition-all group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2 group-hover:bg-emerald-50 transition-colors">
                        <Plus size={24} />
                      </div>
                      <span className="text-sm font-bold">Add New Address</span>
                    </Link>
                  </div>
                )}

                <button 
                  onClick={() => {
                    if (!selectedAddressId) {
                      toast.error('Please select an address');
                      return;
                    }
                    setStep(2);
                  }} 
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center group"
                >
                  Continue to Payment
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 sm:p-10 rounded-[40px] border border-black/5 shadow-sm">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                  <CreditCard size={24} className="mr-3 text-emerald-600" />
                  Payment Method
                </h3>
                
                <div className="space-y-4 mb-8 sm:mb-10">
                  {[
                    { id: 'card', icon: CreditCard, title: 'Credit / Debit Card', desc: 'Secure via Stripe' },
                    { id: 'gpay', icon: Smartphone, title: 'Google Pay', desc: 'Fast & Secure' },
                    { id: 'cod', icon: Wallet, title: 'Cash on Delivery', desc: 'Pay when you receive' }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={cn(
                        "p-4 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between",
                        paymentMethod === method.id ? "border-emerald-600 bg-emerald-50/30" : "border-black/5 bg-gray-50 hover:bg-white hover:shadow-xl"
                      )}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                          <method.icon size={24} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm sm:text-base">{method.title}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">{method.desc}</p>
                        </div>
                      </div>
                      {paymentMethod === method.id && <div className="w-6 h-6 rounded-full border-4 border-emerald-600 bg-white flex-shrink-0"></div>}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStep(1)} className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center group">
                    Review Order
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 sm:p-10 rounded-[40px] border border-black/5 shadow-sm">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center">
                  <ShieldCheck size={24} className="mr-3 text-emerald-600" />
                  Review & Confirm
                </h3>
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                  <div className="p-4 sm:p-6 bg-gray-50 rounded-3xl border border-black/5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping to:</h4>
                    <p className="text-gray-900 font-bold text-sm sm:text-base">{user?.fullName || 'User'}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {addresses.find(a => a.id === selectedAddressId)?.street}, {addresses.find(a => a.id === selectedAddressId)?.city}
                    </p>
                  </div>
                  <div className="p-4 sm:p-6 bg-gray-50 rounded-3xl border border-black/5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method:</h4>
                    <p className="text-gray-900 font-bold capitalize text-sm sm:text-base">{paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'gpay' ? 'Google Pay' : 'Cash on Delivery'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setStep(2)} className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">Back</button>
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl shadow-black/5 sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-black/5">
                {/* Coupon Input */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-black/5 rounded-xl focus:outline-none focus:border-emerald-600 text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-black text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      {isValidatingCoupon ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                    </button>
                  </div>
                  {coupon && (
                    <div className="mt-2 flex items-center justify-between text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg">
                      <span>Applied: <strong>{coupon.code}</strong> ({coupon.discount}% off)</span>
                      <button onClick={removeCoupon} className="hover:text-emerald-900 font-bold">Remove</button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-600 text-sm">
                    <span>Discount ({coupon.discount}%)</span>
                    <span className="font-bold">-₹{(cartTotal - discountedTotal).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
