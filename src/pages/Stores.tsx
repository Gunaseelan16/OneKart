import React from 'react';
import { motion } from 'motion/react';
import { Star, Users, Calendar, ArrowRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAMPLE_SELLERS } from '../constants';

export default function Stores() {
  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Store size={14} />
            Verified Stores
          </motion.div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">Our Top Stores</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover and follow your favorite brands. Shop directly from verified official stores for the best quality and service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_SELLERS.map((seller, i) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
                  <img
                    src={seller.logo}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                  <Star size={12} fill="currentColor" />
                  {seller.rating}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {seller.name}
              </h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                {seller.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  <span className="text-xs font-medium">{seller.followers} Followers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span className="text-xs font-medium">Since {seller.joinedDate}</span>
                </div>
              </div>

              <Link
                to={`/store/${seller.brand}`}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-black hover:text-white transition-all group/btn"
              >
                Visit Store
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Become a Store CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-emerald-600 rounded-[40px] p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Want to sell on OneKart?</h2>
            <p className="text-emerald-100 mb-8 max-w-xl mx-auto">Join thousands of successful businesses and start reaching millions of customers today.</p>
            <Link
              to="/create-store"
              className="px-10 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
            >
              Open Your Store
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
