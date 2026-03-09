import React from 'react';
import { CATEGORIES } from '../constants';

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

const BRANDS = ['VisionTech', 'SoundPro', 'Apple', 'UrbanStyle', 'Bloom', 'HomeDecor', 'CoolTech', 'PureSkin', 'GlowUp', 'FitLife', 'Nomad', 'SleepWell', 'LuxuryLinens'];

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands
}: FilterSidebarProps) {
  
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="space-y-10">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Categories</h3>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`block text-sm transition-colors ${selectedCategory === 'All' ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
          >
            All Products
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block text-sm transition-colors ${selectedCategory === cat ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Price Range</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="100000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>₹0</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Brands</h3>
        <div className="space-y-3">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes (Mock) */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <button
              key={size}
              className="w-10 h-10 rounded-xl border border-black/5 text-xs font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors (Mock) */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map(color => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              className="w-6 h-6 rounded-full border border-black/10 shadow-sm hover:scale-110 transition-transform"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
