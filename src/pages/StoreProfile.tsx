import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Users, Calendar, MapPin, Share2, Heart, Filter, Grid, List as ListIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function StoreProfile() {
  const { brandName } = useParams(); // This is actually the storeId
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStoreData();
  }, [brandName]);

  const fetchStoreData = async () => {
    setIsLoading(true);
    try {
      // Fetch store details
      const storeResponse = await fetch(`/api/store/${brandName}`);
      if (storeResponse.ok) {
        const storeData = await storeResponse.json();
        setSeller(storeData);
      }

      // Fetch store products
      const productsResponse = await fetch(`/api/products/store/${brandName}`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Store not found</h2>
          <Link to="/stores" className="text-emerald-600 font-bold">Back to Stores</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      {/* Store Header Banner */}
      <div className="h-64 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000"
            alt="Banner"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-black/5 mb-12">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl bg-white p-4">
              <img
                src={seller.logo}
                alt={seller.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{seller.name}</h1>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                  <Star size={12} fill="currentColor" />
                  {seller.rating || '4.5'} (4.5k Reviews)
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Verified Mall</span>
              </div>
              
              <p className="text-gray-500 max-w-2xl mb-6 leading-relaxed">
                {seller.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-emerald-600" />
                  <span className="font-bold text-gray-900">{seller.followers || '1.2k'}</span> Followers
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-600" />
                  Joined <span className="font-bold text-gray-900">{new Date(seller.created_at).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  <span className="font-bold text-gray-900">Mumbai, India</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                Follow Store
              </button>
              <div className="flex gap-3">
                <button className="flex-1 md:flex-none p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center">
                  <Share2 size={20} />
                </button>
                <button className="flex-1 md:flex-none p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Store Content */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm sticky top-32">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Filter size={18} />
                Store Categories
              </h3>
              <div className="space-y-4">
                {['All Products', 'New Arrivals', 'Best Sellers', 'On Sale'].map(cat => (
                  <button key={cat} className="block w-full text-left text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors">
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-gray-100">
                <h3 className="text-lg font-bold mb-6">Store Info</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Rate</span>
                    <span className="font-bold text-gray-900">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time</span>
                    <span className="font-bold text-gray-900">Within hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Products</span>
                    <span className="font-bold text-gray-900">{products.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Store Products</h2>
              <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-black/5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                  <p className="text-gray-400">No products found for this store.</p>
                  <Link to="/shop" className="text-emerald-600 font-bold mt-2 inline-block">Browse All Products</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
