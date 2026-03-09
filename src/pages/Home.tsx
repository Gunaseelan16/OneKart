import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryMarquee from '../components/CategoryMarquee';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(0, 4);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-[#f5f5f5]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-widest mb-6">
              New Collection 2026
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 leading-[0.9] mb-8">
              Elevate Your <br />
              <span className="text-emerald-600">Digital Lifestyle.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
              Discover the perfect blend of style and technology. From premium watches to cutting-edge electronics, OneKart brings you the best of both worlds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center group shadow-xl shadow-black/10"
              >
                Shop Now
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="px-8 py-4 bg-white text-black border border-black/5 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                View Categories
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] hidden lg:block"
        >
          <div className="w-64 h-80 bg-white rounded-3xl shadow-2xl p-4 rotate-6 border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"
              alt="Featured Watch"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      <CategoryMarquee />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On all orders over ₹1,000" },
            { icon: Shield, title: "Secure Payment", desc: "100% protected transactions" },
            { icon: RefreshCw, title: "Easy Returns", desc: "30-day money back guarantee" },
            { icon: Zap, title: "Fast Delivery", desc: "Express shipping worldwide" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-gray-50 border border-black/5 hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <feature.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 block">
                Top Picks
              </span>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">Featured Products</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-emerald-600 hover:underline flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative h-[400px] rounded-[40px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000"
              alt="Banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-12">
              <div className="max-w-md text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Upgrade Your Tech <br />
                  <span className="text-emerald-400">Save up to 40%</span>
                </h2>
                <p className="text-gray-300 mb-8">
                  Don't miss out on our seasonal gadget sale. Limited time offer on all premium electronics.
                </p>
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all inline-block shadow-lg shadow-emerald-600/20"
                >
                  Explore Gadgets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 block">
                Just In
              </span>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-emerald-600 hover:underline flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(product => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Join the OneKart Community</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Subscribe to our newsletter and get 10% off your first order. Be the first to know about new arrivals and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-600 transition-colors text-white"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
