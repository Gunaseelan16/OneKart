import { motion } from 'motion/react';
import { ArrowRight, Laptop, Watch, Shirt, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils';

const CATEGORY_DATA = [
  {
    name: 'Electronics',
    count: 124,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800',
    icon: Laptop,
    color: 'bg-blue-500'
  },
  {
    name: 'Watches',
    count: 85,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    icon: Watch,
    color: 'bg-amber-500'
  },
  {
    name: 'Clothes',
    count: 210,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    icon: Shirt,
    color: 'bg-emerald-500'
  },
  {
    name: 'Gadgets',
    count: 56,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
    icon: Smartphone,
    color: 'bg-purple-500'
  }
];

export default function Categories() {
  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">Browse Categories</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover our wide range of products organized by category to help you find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORY_DATA.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[400px] rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-10 flex items-end justify-between">
                <div className="text-white">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg", category.color)}>
                    <category.icon size={24} />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 tracking-tight">{category.name}</h3>
                  <p className="text-gray-300 text-sm">{category.count} Products Available</p>
                </div>
                <Link
                  to={`/shop?category=${category.name}`}
                  className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-xl group/btn"
                >
                  <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 relative h-[300px] rounded-[40px] overflow-hidden bg-black text-white p-12 flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000"
              alt="Promo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-lg">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">New Season Arrivals</h2>
            <p className="text-gray-400 mb-8">Explore the latest trends in technology and fashion. Fresh styles and cutting-edge gadgets added daily.</p>
            <Link to="/shop" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all inline-block">
              Shop All Collections
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
