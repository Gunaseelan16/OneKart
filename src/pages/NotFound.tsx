import { motion } from 'motion/react';
import { Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[120px] font-bold text-emerald-600 leading-none mb-8 tracking-tighter"
        >
          404
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            to="/"
            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center"
          >
            <Search size={20} className="mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
