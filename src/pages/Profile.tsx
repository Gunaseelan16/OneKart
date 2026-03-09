import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Package, Settings, LogOut, ChevronRight, MapPin, CreditCard, Plus, X, Trash2 } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils';
import { Address } from '../types';

export default function Profile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      street: '123 Commerce St',
      city: 'Digital City',
      state: 'DC',
      zipCode: '10101',
      country: 'United States',
      isDefault: true
    }
  ]);

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });

  if (isLoaded && !isSignedIn) {
    navigate('/auth');
    return null;
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      ...newAddress as Address,
      id: Math.random().toString(36).substr(2, 9),
    };
    setAddresses([...addresses, address]);
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
  };

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-50 mx-auto mb-4">
                <img src={user.imageUrl} alt={user.firstName || ''} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
              <p className="text-sm text-gray-500 mb-6">{user.primaryEmailAddress?.emailAddress}</p>
              <button
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="w-full py-3 bg-gray-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>

            <div className="bg-white p-4 rounded-[32px] border border-black/5 shadow-sm">
              {[
                { id: 'orders', icon: Package, label: "My Orders" },
                { id: 'addresses', icon: MapPin, label: "Addresses" },
                { id: 'payments', icon: CreditCard, label: "Payments" },
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
                  <div className="space-y-6">
                    {[
                      { id: "#OK-98234", date: "Oct 24, 2024", status: "Delivered", total: 27499 },
                      { id: "#OK-98112", date: "Sep 12, 2024", status: "Processing", total: 7499 }
                    ].map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-black/5 group hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate(`/order-tracking/${order.id.replace('#', '')}`)}>
                        <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <Package size={22} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{order.id}</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2",
                            order.status === 'Delivered' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {order.status}
                          </span>
                          <p className="font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-6 rounded-3xl bg-gray-50 border border-black/5 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => removeAddress(address.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4">
                            <MapPin size={20} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 capitalize">{address.type}</p>
                            {address.isDefault && (
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Default</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {address.street}, {address.city}<br />
                          {address.state} {address.zipCode}, {address.country}
                        </p>
                      </div>
                    ))}
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
