import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  'Electronics', 'Gadgets', 'Clothes', 'Furniture', 'Bags', 
  'Gym Equipment', 'Ladies Section', 'Mens Section', 'Kids Section', 
  'Bed', 'Bedsheet', 'Pillow', 'Home Appliances', 'Laptop', 
  'Phones', 'Ladies Beauty', 'Mens Beauty'
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'e1',
    name: 'Ultra HD Smart TV 55"',
    description: 'Experience cinematic visuals with our latest 4K Ultra HD Smart TV.',
    price: 49999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 1240,
    brand: 'VisionTech',
    isFeatured: true
  },
  {
    id: 'g1',
    name: 'Pro Wireless Earbuds',
    description: 'Noise-canceling wireless earbuds with 30-hour battery life.',
    price: 9999,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 850,
    brand: 'SoundPro',
    isNew: true
  },
  {
    id: 'l1',
    name: 'MacBook Pro M3',
    description: 'The most powerful MacBook yet, featuring the M3 chip.',
    price: 169999,
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 450,
    brand: 'Apple'
  },
  {
    id: 'p1',
    name: 'iPhone 15 Pro',
    description: 'Titanium design, A17 Pro chip, and advanced camera system.',
    price: 129999,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 2100,
    brand: 'Apple'
  },
  {
    id: 'c1',
    name: 'Premium Cotton Hoodie',
    description: 'Soft, breathable cotton hoodie perfect for everyday wear.',
    price: 2499,
    category: 'Mens Section',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    reviews: 320,
    brand: 'UrbanStyle',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy']
  },
  {
    id: 'c2',
    name: 'Floral Summer Dress',
    description: 'Lightweight and stylish summer dress with floral patterns.',
    price: 1999,
    category: 'Ladies Section',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviews: 180,
    brand: 'Bloom',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'f1',
    name: 'Modern Velvet Sofa',
    description: 'Luxurious velvet sofa that adds elegance to any living room.',
    price: 74999,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 95,
    brand: 'HomeDecor'
  },
  {
    id: 'h1',
    name: 'Smart Refrigerator',
    description: 'Energy-efficient refrigerator with smart cooling technology.',
    price: 124999,
    category: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1571175432291-6a5f81426a24?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 150,
    brand: 'CoolTech'
  },
  {
    id: 'b1',
    name: 'Organic Sunscreen SPF 50',
    description: 'Non-greasy, water-resistant organic sunscreen.',
    price: 1499,
    category: 'Mens Beauty',
    image: 'https://images.unsplash.com/photo-1556229162-5c63ed9c4efb?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 560,
    brand: 'PureSkin'
  },
  {
    id: 'b2',
    name: 'Hydrating Face Wash',
    description: 'Gentle hydrating face wash for all skin types.',
    price: 999,
    category: 'Ladies Beauty',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 420,
    brand: 'GlowUp'
  },
  {
    id: 'gym1',
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells for home workouts.',
    price: 14999,
    category: 'Gym Equipment',
    image: 'https://images.unsplash.com/photo-1586406472616-b459ad4933e2?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 230,
    brand: 'FitLife'
  },
  {
    id: 'bag1',
    name: 'Leather Travel Backpack',
    description: 'Durable and stylish leather backpack for travelers.',
    price: 4999,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviews: 310,
    brand: 'Nomad'
  },
  {
    id: 'bed1',
    name: 'Memory Foam Pillow',
    description: 'Ergonomic memory foam pillow for a better night sleep.',
    price: 2499,
    category: 'Pillow',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 890,
    brand: 'SleepWell'
  },
  {
    id: 'bs1',
    name: 'Egyptian Cotton Bedsheet',
    description: 'Soft and breathable Egyptian cotton bedsheet set.',
    price: 3999,
    category: 'Bedsheet',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 450,
    brand: 'LuxuryLinens'
  }
];

export const SAMPLE_SELLERS = [
  {
    id: 's1',
    name: 'VisionTech Official',
    description: 'Leading provider of high-end display technology and smart home entertainment.',
    logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    followers: '12.5k',
    joinedDate: 'Jan 2022',
    brand: 'VisionTech'
  },
  {
    id: 's2',
    name: 'Apple Store',
    description: 'The official destination for all Apple products and accessories.',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?auto=format&fit=crop&q=80&w=200',
    rating: 5.0,
    followers: '1.2M',
    joinedDate: 'Mar 2021',
    brand: 'Apple'
  },
  {
    id: 's3',
    name: 'UrbanStyle Fashion',
    description: 'Modern, sustainable, and stylish clothing for the urban lifestyle.',
    logo: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200',
    rating: 4.6,
    followers: '45k',
    joinedDate: 'Jun 2023',
    brand: 'UrbanStyle'
  }
];
