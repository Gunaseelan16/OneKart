import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price <= priceRange[1]);

    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategory, sortBy, priceRange, selectedBrands, searchQuery]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2">Our Shop</h1>
            <p className="text-gray-500">Showing {filteredProducts.length} products</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-black/5 rounded-2xl focus:outline-none focus:border-emerald-600 transition-all w-full sm:w-64 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden flex-1 sm:flex-none p-3 bg-white border border-black/5 rounded-2xl text-gray-600 hover:text-emerald-600 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <SlidersHorizontal size={20} />
                <span className="text-sm font-bold sm:hidden">Filters</span>
              </button>
              <div className="flex-1 sm:flex-none flex items-center space-x-4 bg-white p-2 rounded-2xl border border-black/5 shadow-sm">
                <div className="flex items-center px-3 text-gray-500">
                  <SlidersHorizontal size={18} />
                  <span className="ml-2 text-sm font-medium hidden xs:inline">Sort:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-bold focus:outline-none pr-4 py-2 flex-1"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className={`lg:col-span-1 fixed inset-0 z-50 lg:relative lg:z-0 lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black/40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            <div className="relative h-full bg-white lg:bg-transparent p-8 lg:p-0 w-80 lg:w-full overflow-y-auto lg:overflow-visible shadow-2xl lg:shadow-none">
              <div className="flex items-center justify-between mb-8 lg:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
              </div>
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 100000]);
                    setSelectedBrands([]);
                    setSearchQuery('');
                  }}
                  className="mt-6 px-8 py-3 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
