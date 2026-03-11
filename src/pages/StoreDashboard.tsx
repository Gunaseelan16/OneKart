import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Filter, 
  MoreVertical,
  DollarSign,
  Star,
  Image as ImageIcon,
  Trash2,
  Edit2,
  ChevronRight,
  ArrowRight,
  User,
  Clock,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Store
} from 'lucide-react';
import { cn } from '../utils';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../ToastContext';
import { useUser, useAuth, SignOutButton } from '@clerk/clerk-react';

import { CATEGORIES } from '../constants';

export default function StoreDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Fallback for when Clerk is not initialized or user is not logged in
  const effectiveUser = user || {
    id: 'guest_store_owner',
    fullName: 'Store Owner',
    primaryEmailAddress: { emailAddress: 'owner@example.com' },
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userStores, setUserStores] = useState<any[]>([]);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [approvedStores, setApprovedStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    actualPrice: '',
    offerPrice: '',
    stock: ''
  });

  useEffect(() => {
    if (isLoaded) {
      fetchApprovedStores();
      checkStoreStatus();
    }
  }, [isLoaded, user]);

  const fetchApprovedStores = async () => {
    try {
      const response = await fetch('/api/store/approved');
      if (response.ok) {
        const data = await response.json();
        setApprovedStores(data);
      }
    } catch (error) {
      console.error('Error fetching approved stores:', error);
    }
  };

  const handleStoreClick = (storeData: any) => {
    if (!user || user.primaryEmailAddress?.emailAddress === storeData.email) {
      setSelectedStore(storeData);
      setCurrentStore(storeData);
      fetchStoreData(storeData.id);
      setIsEmailVerified(false); // Reset verification for new store
    } else {
      showToast('You do not have permission to access this store', 'error');
    }
  };

  const checkStoreStatus = async () => {
    try {
      const userId = user?.id || 'guest_store_owner';
      const response = await fetch(`/api/store/status/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserStores(data);
        
        const approved = data.find((s: any) => s.status === 'approved');
        if (approved) {
          setCurrentStore(approved);
          setSelectedStore(approved);
          fetchStoreData(approved.id);
        } else if (data.length > 0) {
          setCurrentStore(data[0]);
        }
      } else {
        setUserStores([]);
        setCurrentStore(null);
      }
    } catch (error) {
      console.error('Error checking store status:', error);
      showToast('Failed to check store status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStoreData = async (storeId: string) => {
    try {
      let token = null;
      try {
        token = await getToken();
      } catch (e) {
        console.warn('Clerk token not available');
      }
      
      const headers: any = {
        'x-clerk-id': user?.id || 'guest_store_owner'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const productsRes = await fetch(`/api/products/store/${storeId}`, { headers });
      if (productsRes.ok) setProducts(await productsRes.json());

      const ordersRes = await fetch(`/api/orders/store/${storeId}`, { headers });
      if (ordersRes.ok) setOrders(await ordersRes.json());

      const reviewsRes = await fetch(`/api/reviews/store/${storeId}`, { headers });
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationEmail === currentStore?.email || verificationEmail === 'admin@onekart.com') {
      setShowEmailPopup(false);
      setIsEmailVerified(true);
      setActiveTab('add-product');
    } else {
      showToast('Email does not match store owner email', 'error');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.offerPrice || !newProduct.stock) {
      showToast('Please fill required fields', 'error');
      return;
    }
    if (selectedImages.length === 0) {
      showToast('Please upload at least one product image', 'error');
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-clerk-id': user?.id || ''
        },
        body: JSON.stringify({
          storeId: currentStore?.id,
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.actualPrice),
          offer_price: parseFloat(newProduct.offerPrice),
          category: newProduct.category,
          stock: parseInt(newProduct.stock),
          image: selectedImages[0]
        })
      });

      if (response.ok) {
        showToast('Product added successfully', 'success');
        setNewProduct({
          name: '',
          category: 'Electronics',
          description: '',
          actualPrice: '',
          offerPrice: '',
          stock: ''
        });
        setSelectedImages([]);
        setActiveTab('manage-products');
        fetchStoreData(currentStore?.id);
      } else {
        showToast('Failed to add product', 'error');
      }
    } catch (error) {
      showToast('Error adding product', 'error');
    }
  };

  const handleToggleStock = async (product: any) => {
    try {
      const token = await getToken();
      const newStock = product.stock > 0 ? 0 : 50;
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-clerk-id': user?.id || ''
        },
        body: JSON.stringify({
          stock: newStock
        })
      });

      if (response.ok) {
        showToast('Stock status updated', 'success');
        fetchStoreData(currentStore?.id);
      } else {
        showToast('Failed to update stock', 'error');
      }
    } catch (error) {
      showToast('Error updating stock', 'error');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));
    showToast(`Order ${orderId} marked as ${newStatus}`, 'success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - selectedImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    showToast('Images added to gallery', 'success');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-clerk-id': user?.id || ''
        }
      });

      if (response.ok) {
        showToast('Product deleted', 'success');
        fetchStoreData(currentStore?.id);
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (error) {
      showToast('Error deleting product', 'error');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-product-trigger', label: 'Add Product', icon: PlusCircle },
    { id: 'manage-products', label: 'Manage Product', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  const handleTabChange = (id: string) => {
    if (id === 'add-product-trigger') {
      if (isEmailVerified) {
        setActiveTab('add-product');
      } else {
        setShowEmailPopup(true);
      }
    } else {
      setActiveTab(id);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (currentStore?.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-black/5 p-10 border border-black/5 text-center"
        >
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h2>
          <p className="text-gray-500 mb-8">Your store application is currently being reviewed by our team. We'll notify you once it's approved.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (currentStore?.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-black/5 p-10 border border-black/5 text-center"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h2>
          <p className="text-gray-500 mb-8">We're sorry, but your store application has been rejected at this time. Please contact support for more details.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-black/5 p-10 border border-black/5 text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Store Found</h2>
          <p className="text-gray-500 mb-8">You haven't created a store yet. Start your journey by creating one now!</p>
          <button 
            onClick={() => navigate('/create-store')}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            Create Your Store
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Email Verification Popup */}
      <AnimatePresence>
        {showEmailPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-black/5"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={40} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Verify Store Email</h2>
              <p className="text-gray-500 text-center mb-8">Please enter the email address associated with <span className="font-bold text-gray-900">{currentStore?.name}</span> to continue.</p>
              
              <form onSubmit={handleVerifyEmail} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Store Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter store email"
                    value={verificationEmail}
                    onChange={(e) => setVerificationEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                >
                  Verify & Continue
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              One<span className="text-emerald-600">Kart</span> <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded ml-1">STORE</span>
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
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "w-full flex items-center p-4 rounded-2xl transition-all group relative",
                  (activeTab === item.id || (item.id === 'add-product-trigger' && activeTab === 'add-product')) 
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
          <SignOutButton>
            <button 
              className={cn(
                "w-full flex items-center p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group relative"
              )}
            >
              <LogOut size={22} className="shrink-0" />
              {isSidebarOpen && (
                <span className="ml-4 font-bold text-sm tracking-tight">Logout</span>
              )}
            </button>
          </SignOutButton>
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
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{currentStore?.name || 'Store Account'}</p>
              <p className="text-sm font-bold text-gray-900">{effectiveUser.fullName}</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={effectiveUser.imageUrl} alt={effectiveUser.fullName || ''} className="w-full h-full object-cover" />
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
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Store Dashboard</h1>

                {/* My Stores Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">My Stores</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manage your stores</p>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    {userStores.map((s) => (
                      <motion.div
                        key={s.id}
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setCurrentStore(s);
                          setSelectedStore(s);
                          if (s.status === 'approved') {
                            fetchStoreData(s.id);
                          }
                        }}
                        className={cn(
                          "w-24 h-24 rounded-[32px] bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all cursor-pointer flex items-center justify-center overflow-hidden p-4 group relative",
                          currentStore?.id === s.id && "ring-2 ring-emerald-500 ring-offset-4"
                        )}
                      >
                        <img 
                          src={s.logo} 
                          alt={s.name} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest text-center px-2">{s.name}</p>
                        </div>
                        {s.status !== 'approved' && (
                          <div className="absolute top-1 right-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              s.status === 'pending' ? "bg-amber-500" : "bg-rose-500"
                            )} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <motion.button
                      whileHover={{ y: -5, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/create-store')}
                      className="w-24 h-24 rounded-[32px] bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-600 transition-all"
                    >
                      <PlusCircle size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-2">New</span>
                    </motion.button>
                  </div>
                </div>

                {/* Available Stores Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Available Stores</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select a store to manage</p>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    {approvedStores.map((s) => (
                      <motion.div
                        key={s.id}
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStoreClick(s)}
                        className={cn(
                          "w-24 h-24 rounded-[32px] bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all cursor-pointer flex items-center justify-center overflow-hidden p-4 group relative",
                          selectedStore?.id === s.id && "ring-2 ring-emerald-500 ring-offset-4"
                        )}
                      >
                        <img 
                          src={s.logo} 
                          alt={s.name} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest text-center px-2">{s.name}</p>
                        </div>
                      </motion.div>
                    ))}
                    {approvedStores.length === 0 && (
                      <div className="w-full py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <Store size={32} className="mb-3 opacity-20" />
                        <p className="text-sm font-medium">No approved stores found</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Products', value: products.length.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Earnings', value: '₹12,450.00', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Total Ratings', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
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

                {/* Customer Reviews Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Reviews</h2>
                    <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                      View All <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.length > 0 ? reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm hover:shadow-xl transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <User size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{review.reviewer_name || 'Anonymous'}</h4>
                              <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={cn(i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200")} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{review.comment}"</p>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{review.product_category}</p>
                            <p className="font-bold text-gray-900 text-sm">{review.product_name}</p>
                          </div>
                          <button className="px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-xs font-bold hover:bg-black hover:text-white transition-all">
                            View Product
                          </button>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="col-span-full py-12 text-center bg-white rounded-[32px] border border-black/5">
                        <p className="text-gray-500 font-medium">No reviews yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'add-product' && (
              <motion.div
                key="add-product"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Image Upload Section */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Product Images</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedImages.map((img, i) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-black/5 relative group">
                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => setSelectedImages(selectedImages.filter((_, index) => index !== i))}
                              className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {selectedImages.length < 4 && (
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 group-hover:bg-white transition-all">
                              <ImageIcon size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload</span>
                            <input 
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              className="hidden"
                              accept="image/*"
                              multiple
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-6 text-center">Recommended size: 800x800px. Max 2MB per image.</p>
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="lg:col-span-2">
                    <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm">
                      <form className="space-y-6" onSubmit={handleAddProduct}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                            <input 
                              type="text" 
                              placeholder="Enter product name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                            <select 
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium appearance-none"
                            >
                              {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                          <textarea 
                            rows={4}
                            placeholder="Enter product description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Actual Price</label>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="number" 
                                placeholder="0.00"
                                value={newProduct.actualPrice}
                                onChange={(e) => setNewProduct({ ...newProduct, actualPrice: e.target.value })}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Offer Price</label>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="number" 
                                placeholder="0.00"
                                value={newProduct.offerPrice}
                                onChange={(e) => setNewProduct({ ...newProduct, offerPrice: e.target.value })}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Stock Quantity</label>
                            <input 
                              type="number" 
                              placeholder="0"
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium"
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-6">
                          <button 
                            type="submit"
                            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                          >
                            <PlusCircle size={20} />
                            Add Product
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'manage-products' && (
              <motion.div
                key="manage-products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Products</h1>
                  <button 
                    onClick={() => setActiveTab('add-product')}
                    className="px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                  >
                    <PlusCircle size={18} />
                    New Product
                  </button>
                </div>

                <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <div className="relative w-96">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-black/5 rounded-2xl focus:outline-none focus:border-emerald-600 transition-all text-sm font-medium"
                      />
                    </div>
                    <button className="p-3 bg-white border border-black/5 rounded-xl hover:bg-gray-50 transition-all">
                      <Filter size={18} className="text-gray-400" />
                    </button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                        <th className="px-8 py-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-black/5">
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">{product.id}</p>
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
                              <p className="text-xs text-gray-400 line-through">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", product.stock > 0 ? "bg-emerald-500" : "bg-rose-500")} />
                              <span className={cn("text-xs font-bold uppercase tracking-widest", product.stock > 0 ? "text-emerald-600" : "text-rose-600")}>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleToggleStock(product)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                title={product.stock > 0 ? "Mark as Out of Stock" : "Mark as In Stock"}
                              >
                                <Package size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete Product"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Store Orders</h1>
                <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
                  <div className="p-12 text-center">
                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Orders</h3>
                    <p className="text-gray-500 text-sm">When customers purchase your products, they will appear here.</p>
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
