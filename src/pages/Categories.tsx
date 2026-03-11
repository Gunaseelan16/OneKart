import { motion } from 'motion/react';
import { ArrowRight, Laptop, Watch, Shirt, Smartphone, ShoppingBag, Dumbbell, Home, Book, Music, Heart, Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils';
import { CATEGORIES } from '../constants';

const CATEGORY_ICONS: Record<string, any> = {
  'Electronics': Laptop,
  'Watches': Watch,
  'Clothes': Shirt,
  'Gadgets': Smartphone,
  'Bags': ShoppingBag,
  'Gym Equipment': Dumbbell,
  'Furniture': Home,
  'Books': Book,
  'Sports': Music,
  'Ladies Beauty': Heart,
  'Mens Beauty': Heart,
  'Footwear': Footprints,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Electronics': 'bg-blue-500',
  'Watches': 'bg-amber-500',
  'Clothes': 'bg-emerald-500',
  'Gadgets': 'bg-purple-500',
  'Bags': 'bg-pink-500',
  'Gym Equipment': 'bg-orange-500',
  'Furniture': 'bg-stone-500',
  'Books': 'bg-indigo-500',
  'Sports': 'bg-red-500',
  'Ladies Beauty': 'bg-rose-500',
  'Mens Beauty': 'bg-cyan-500',
  'Footwear': 'bg-lime-500',
};

const CATEGORY_IMAGES: Record<string, string> = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800',
  'Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  'Clothes': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
  'Gadgets': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
  'Bags': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
  'Gym Equipment': 'https://images.unsplash.com/photo-1586406472616-b459ad4933e2?auto=format&fit=crop&q=80&w=800',
  'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
  'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800',
  'Sports': 'https://images.unsplash.com/photo-1461896704190-32137b238a79?auto=format&fit=crop&q=80&w=800',
  'Ladies Beauty': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
  'Mens Beauty': 'https://images.unsplash.com/photo-1556229162-5c63ed9c4efb?auto=format&fit=crop&q=80&w=800',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
};

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((categoryName, i) => {
            const Icon = CATEGORY_ICONS[categoryName] || ShoppingBag;
            const color = CATEGORY_COLORS[categoryName] || 'bg-emerald-500';
            const image = CATEGORY_IMAGES[categoryName] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800';

            return (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative h-[300px] rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={image}
                  alt={categoryName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                  <div className="text-white">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-lg", color)}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-2xl font-bold mb-1 tracking-tight">{categoryName}</h3>
                    <p className="text-gray-300 text-xs">Explore Collection</p>
                  </div>
                  <Link
                    to={`/shop?category=${categoryName}`}
                    className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-xl group/btn"
                  >
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
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
