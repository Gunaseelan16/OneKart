import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Store, 
  Package, 
  Mail, 
  User, 
  Calendar, 
  ExternalLink,
  ShoppingBag,
  DollarSign,
  Star,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../utils';
import { useToast } from '../ToastContext';
import { useUser } from '@clerk/clerk-react';

export default function AdminStoreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { showToast } = useToast();
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'gunaseelanrk25@gmail.com';

  useEffect(() => {
    if (isUserLoaded) {
      if (!user || user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
        showToast('Access denied. Admin only.', 'error');
        navigate('/');
        return;
      }
      fetchStoreDetails();
    }
  }, [id, isUserLoaded, user]);

  const fetchStoreDetails = async () => {
    if (!user) return;
    try {
      const headers = {
        'x-clerk-id': user.id,
        'x-clerk-email': user.primaryEmailAddress?.emailAddress || ''
      };
      const response = await fetch(`/api/admin/store/${id}`, { headers });
      if (response.ok) {
        setStore(await response.json());
      } else {
        showToast('Failed to fetch store details', 'error');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error loading store details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) return null;

  const filteredProducts = store.products?.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-black/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Store Details</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              store.status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            )}>
              {store.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-black/5 overflow-hidden mb-4 flex items-center justify-center">
                  {store.logo ? (
                    <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store size={40} className="text-gray-300" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{store.name}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{store.description}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Owner ID</p>
                    <p className="font-bold text-gray-900">{store.owner_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="font-bold text-gray-900">{store.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined On</p>
                    <p className="font-bold text-gray-900">{new Date(store.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link 
                  to={`/store/${store.name}`}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  Visit Store <ExternalLink size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                <Package size={20} className="text-blue-600 mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products</p>
                <p className="text-xl font-bold text-gray-900">{store.products?.length || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                <ShoppingBag size={20} className="text-purple-600 mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                <p className="text-xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          {/* Products Table Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900">Uploaded Products</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all text-sm font-medium w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-50">
                      <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((product: any) => (
                      <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl border border-black/5 overflow-hidden">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{product.name}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest">SKU: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-900">₹{parseFloat(product.offer_price).toLocaleString('en-IN')}</p>
                          {product.price > product.offer_price && (
                            <p className="text-[10px] text-gray-400 line-through">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", product.stock > 0 ? "bg-emerald-500" : "bg-rose-500")} />
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", product.stock > 0 ? "text-emerald-600" : "text-rose-600")}>
                              {product.stock}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <Package size={40} className="mx-auto text-gray-200 mb-4" />
                          <p className="text-gray-500 font-medium">No products found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
