import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';

export default function CategoryMarquee() {
  // Duplicate categories to ensure smooth loop
  const duplicatedCategories = [...CATEGORIES, ...CATEGORIES];

  return (
    <div className="bg-black py-4 overflow-hidden whitespace-nowrap border-y border-white/10">
      <motion.div
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="inline-block"
      >
        {duplicatedCategories.map((category, index) => (
          <Link
            key={`${category}-${index}`}
            to={`/shop?category=${category}`}
            className="inline-block px-8 text-sm font-bold text-white/60 hover:text-emerald-400 transition-colors uppercase tracking-widest"
          >
            {category}
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
