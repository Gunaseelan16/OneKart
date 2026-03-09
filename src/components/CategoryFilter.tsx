import { motion } from 'motion/react';
import { CATEGORIES } from '../constants';
import { cn } from '../utils';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
      {CATEGORIES.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category)}
          className={cn(
            'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border',
            selectedCategory === category
              ? 'bg-black text-white border-black shadow-lg shadow-black/20'
              : 'bg-white text-gray-600 border-black/5 hover:border-black/20 hover:bg-gray-50'
          )}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}
