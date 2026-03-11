import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Package, Settings, LogOut, ChevronRight, MapPin, CreditCard, Plus, X, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../utils';
import { Address } from '../types';
import { useToast } from '../ToastContext';
import { useUser, SignOutButton } from '@clerk/clerk-react';

export default function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('orders');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    } else if (isLoaded && !user) {
      navigate('/');
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      showToast('Payment successful! Your order has been placed.', 'success');
      setActiveTab('orders');
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      const [addrRes, orderRes] = await Promise.all([
        fetch(`/api/user/profile/${user.id}`),
        fetch(`/api/orders/${user.id}`)
      ]);

      if (addrRes.ok) {
        const profileData = await addrRes.json();
        setAddresses(profileData.addresses || []);
      }

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...newAddress,
          zip_code: newAddress.zipCode
        })
      });

      if (response.ok) {
        showToast('Address added successfully', 'success');
        fetchData();
        setIsAddressModalOpen(false);
        setNewAddress({
          type: 'home',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
          isDefault: false
        });
      } else {
        showToast('Failed to add address', 'error');
      }
    } catch (error) {
      showToast('Error adding address', 'error');
    }
  };

  const removeAddress = async (id: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showToast('Address removed', 'success');
        fetchData();
      } else {
        showToast('Failed to remove address', 'error');
      }
    } catch (error) {
      showToast('Error removing address', 'error');
    }
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-50 mx-auto mb-4">
                <img src={user?.imageUrl} alt={user?.firstName || ''} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-sm text-gray-500 mb-6">{user?.primaryEmailAddress?.emailAddress}</p>
              <SignOutButton>
                <button
                  className="w-full py-3 bg-gray-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </SignOutButton>
            </div>

            <div className="bg-white p-4 rounded-[32px] border border-black/5 shadow-sm">
              {[
                { id: 'orders', icon: Package, label: "My Orders" },
                { id: 'addresses', icon: MapPin, label: "Addresses" },
                { id: 'settings', icon: Settings, label: "Settings" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all",
                    activeTab === item.id ? "bg-emerald-50 text-emerald-600" : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon size={20} className="mr-3" />
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Orders</h3>
                  {isLoadingData ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">No orders found yet.</p>
                      <button 
                        onClick={() => navigate('/shop')}
                        className="mt-4 text-emerald-600 font-bold hover:underline"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="p-6 rounded-3xl bg-gray-50 border border-black/5 group hover:bg-white hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-6">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Package size={22} className="text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">Order #{order.id}</p>
                                <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className={cn(
                                  "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2",
                                  order.status === 'Delivered' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                )}>
                                  {order.status}
                                </span>
                                <p className="font-bold text-gray-900">₹{parseFloat(order.total_price).toLocaleString('en-IN')}</p>
                              </div>
                              <button 
                                onClick={() => navigate(`/order-tracking/${order.id}`)}
                                className="p-3 bg-white rounded-xl border border-black/5 text-gray-400 hover:text-emerald-600 hover:border-emerald-600 transition-all"
                              >
                                <ExternalLink size={18} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Order Items Summary */}
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex -space-x-3 overflow-hidden">
                              {order.items?.map((item: any, idx: number) => (
                                <img 
                                  key={idx}
                                  src={item.image} 
                                  alt={item.name}
                                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                                />
                              ))}
                              {order.items?.length > 3 && (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-bold text-gray-500">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <p className="mt-3 text-xs text-gray-500">
                              {order.items?.map((item: any) => item.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">My Addresses</h3>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                    >
                      <Plus size={18} className="mr-2" />
                      Add New Address
                    </button>
                  </div>

                  {isLoadingData ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">No addresses saved yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-6 rounded-3xl bg-gray-50 border border-black/5 relative group">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => removeAddress(address.id.toString())} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4">
                              <MapPin size={20} className="text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 capitalize">{address.type}</p>
                              {address.is_default && (
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Default</span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {address.street}, {address.city}<br />
                            {address.state} {address.zip_code}, {address.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <div className="px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-sm text-gray-900">
                          {user?.fullName}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <div className="px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-sm text-gray-900">
                          {user?.primaryEmailAddress?.emailAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Add New Address</h3>
                  <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Type</label>
                      <select
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as any })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold text-sm"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Country</label>
                      <input
                        type="text"
                        required
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Zip</label>
                      <input
                        type="text"
                        required
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-1">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <label htmlFor="isDefault" className="text-sm font-bold text-gray-600">Set as default address</label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10"
                  >
                    Save Address
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
