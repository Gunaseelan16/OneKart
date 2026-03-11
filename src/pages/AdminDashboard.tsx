import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Store, 
  CheckCircle2, 
  Tag, 
  LogOut, 
  Menu, 
  X, 
  Clock,
  Search, 
  Filter, 
  MoreVertical,
  ShoppingBag,
  DollarSign,
  Users,
  Plus,
  Calendar,
  Trash2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Star,
  MessageSquare
} from 'lucide-react';
import { cn } from '../utils';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../ToastContext';
import { useUser, useAuth } from '@clerk/clerk-react';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'gunaseelanrk25@gmail.com';

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stores, setStores] = useState<any[]>([]);
  const [pendingStores, setPendingStores] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiry: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!user || user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
        showToast('Unauthorized access', 'error');
        navigate('/');
        return;
      }
      fetchData();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'x-clerk-id': user?.id || '',
        'x-clerk-email': user?.primaryEmailAddress?.emailAddress || ''
      };

      const [storesRes, pendingRes, couponsRes, reviewsRes] = await Promise.all([
        fetch('/api/admin/stores', { headers }),
        fetch('/api/admin/stores/pending', { headers }),
        fetch('/api/coupons', { headers }),
        fetch('/api/admin/reviews', { headers })
      ]);

      if (storesRes.ok) setStores(await storesRes.json());
      if (pendingRes.ok) setPendingStores(await pendingRes.json());
      if (couponsRes.ok) setCoupons(await couponsRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (store: any) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/store/approve/${store.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-clerk-id': user?.id || '',
          'x-clerk-email': user?.primaryEmailAddress?.emailAddress || ''
        }
      });

      if (response.ok) {
        showToast(`${store.name} approved successfully`, 'success');
        fetchData();
      } else {
        showToast('Failed to approve store', 'error');
      }
    } catch (error) {
      showToast('Error approving store', 'error');
    }
  };

  const handleReject = async (store: any) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/store/reject/${store.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-clerk-id': user?.id || '',
          'x-clerk-email': user?.primaryEmailAddress?.emailAddress || ''
        }
      });

      if (response.ok) {
        showToast(`${store.name} rejected`, 'error');
        fetchData();
      } else {
        showToast('Failed to reject store', 'error');
      }
    } catch (error) {
      showToast('Error rejecting store', 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiry) {
      showToast('Please fill all coupon fields', 'error');
      return;
    }
    
    try {
      const token = await getToken();
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-clerk-id': user?.id || '',
          'x-clerk-email': user?.primaryEmailAddress?.emailAddress || ''
        },
        body: JSON.stringify({
          code: newCoupon.code,
          discount: parseFloat(newCoupon.discount),
          expiryDate: newCoupon.expiry
        })
      });

      if (response.ok) {
        showToast('Coupon created successfully', 'success');
        setNewCoupon({ code: '', discount: '', expiry: '' });
        fetchData();
      } else {
        showToast('Failed to create coupon', 'error');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      showToast('Error creating coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-clerk-id': user?.id || '',
          'x-clerk-email': user?.primaryEmailAddress?.emailAddress || ''
        }
      });

      if (response.ok) {
        showToast('Coupon deleted', 'success');
        fetchData();
      } else {
        showToast('Failed to delete coupon', 'error');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      showToast('Error deleting coupon', 'error');
    }
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.owner_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] bg-white border-r border-black/5 transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {(isSidebarOpen || !isSidebarOpen) && (
            <Link to="/" className={cn("text-xl font-bold tracking-tighter text-black hover:opacity-80 transition-opacity", !isSidebarOpen && "lg:hidden")}>
              One<span className="text-emerald-600">Kart</span> <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded ml-1">ADMIN</span>
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="px-4 flex-1 mt-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'stores', label: 'Stores', icon: Store },
              { id: 'approval', label: 'Approval Store', icon: CheckCircle2 },
              { id: 'coupon', label: 'Coupon', icon: Tag },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center p-4 rounded-2xl transition-all group relative",
                  activeTab === item.id 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={22} className={cn("shrink-0", activeTab === item.id ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-900")} />
                {isSidebarOpen && (
                  <span className="ml-4 font-bold text-sm tracking-tight">{item.label}</span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-black/5">
          <button 
            onClick={() => signOut(() => navigate('/'))}
            className={cn(
              "w-full flex items-center p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group relative"
            )}
          >
            <LogOut size={22} className="shrink-0" />
            {isSidebarOpen && (
              <span className="ml-4 font-bold text-sm tracking-tight">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
      )}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-black/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            {!isSidebarOpen && (
              <Link to="/" className="text-xl font-bold tracking-tighter text-black hover:opacity-80 transition-opacity lg:hidden">
                One<span className="text-emerald-600">Kart</span>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
              <p className="text-sm font-bold text-gray-900">{user?.firstName || 'Admin'}</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={user?.imageUrl} alt={user?.firstName || ''} className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Stores', value: stores.length.toString(), icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending Approvals', value: pendingStores.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Total Orders', value: '156', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Total Revenue', value: '₹45,230', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
                        <stat.icon size={24} className={stat.color} />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'stores' && (
              <motion.div
                key="stores"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Stores</h1>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search stores..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-white border border-black/5 rounded-2xl focus:outline-none focus:border-emerald-600 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Store</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Owner Name</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Products</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredStores.map((store) => (
                        <tr key={store.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-black/5">
                                {store.logo ? (
                                  <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Store size={20} className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{store.name}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">ID: {store.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-medium text-gray-600">{store.owner_name}</td>
                          <td className="px-8 py-6 font-medium text-gray-600">{store.email}</td>
                          <td className="px-8 py-6 font-bold text-gray-900">{store.product_count}</td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              store.status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {store.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => navigate(`/admin/store/${store.id}`)}
                              className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={18} className="text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'approval' && (
              <motion.div
                key="approval"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Approval Store</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingStores.map((store) => (
                    <motion.div
                      key={store.id}
                      className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                            {store.logo ? (
                              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                            ) : (
                              <Store size={28} />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{store.id}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {store.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Users size={16} className="text-gray-400" />
                          <span className="font-medium">{store.owner_id}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          <span className="font-medium">{store.email}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleApprove(store)}
                          className="py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(store)}
                          className="py-3 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'coupon' && (
              <motion.div
                key="coupon"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Coupon Management</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Create Coupon Form */}
                  <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm sticky top-28">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Coupon</h3>
                      <form className="space-y-4" onSubmit={handleCreateCoupon}>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Coupon Code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. SUMMER50"
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Discount %</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 15"
                            value={newCoupon.discount}
                            onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="date" 
                              value={newCoupon.expiry}
                              onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                              className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-bold"
                            />
                          </div>
                        </div>
                        <button 
                          type="submit"
                          className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4"
                        >
                          <Plus size={20} />
                          Create Coupon
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Coupon List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-gray-100">
                            <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Code</th>
                            <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Discount</th>
                            <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Expiry</th>
                            <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {coupons.map((coupon) => (
                            <tr key={coupon.id} className="group hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-6 font-bold text-gray-900">{coupon.code}</td>
                              <td className="px-8 py-6 font-bold text-emerald-600">{coupon.discount}%</td>
                              <td className="px-8 py-6 text-sm text-gray-500">{new Date(coupon.expiry_date).toLocaleDateString()}</td>
                              <td className="px-8 py-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                  coupon.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                                )}>
                                  {coupon.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button 
                                  onClick={() => handleDeleteCoupon(coupon.id)}
                                  className="p-2 hover:bg-rose-50 rounded-xl transition-colors shadow-sm opacity-0 group-hover:opacity-100 text-rose-500"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Global Reviews</h1>
                
                <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Reviewer</th>
                          <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Store</th>
                          <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                          <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</th>
                          <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Comment</th>
                          <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {reviews.map((review) => (
                          <tr key={review.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <p className="font-bold text-gray-900">{review.reviewer_name}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{review.reviewer_email}</p>
                            </td>
                            <td className="px-8 py-6 font-medium text-gray-600">{review.store_name}</td>
                            <td className="px-8 py-6 font-medium text-gray-600">{review.product_name}</td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-1">
                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                <span className="font-bold text-gray-900">{review.rating}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm text-gray-600 max-w-xs truncate">{review.comment}</p>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {reviews.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center">
                              <MessageSquare size={40} className="mx-auto text-gray-200 mb-4" />
                              <p className="text-gray-500 font-medium">No reviews found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
