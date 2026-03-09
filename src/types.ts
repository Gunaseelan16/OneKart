export type Category = 
  | 'Electronics' | 'Gadgets' | 'Clothes' | 'Furniture' | 'Bags' 
  | 'Gym Equipment' | 'Ladies Section' | 'Mens Section' | 'Kids Section' 
  | 'Bed' | 'Bedsheet' | 'Pillow' | 'Home Appliances' | 'Laptop' 
  | 'Phones' | 'Ladies Beauty' | 'Mens Beauty';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  image_url?: string;
  image_urls?: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin' | 'seller';
  addresses: Address[];
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  paymentMethod: 'Card' | 'GPay' | 'COD';
  address: Address;
  createdAt: string;
  trackingHistory: {
    status: string;
    time: string;
    location: string;
  }[];
}
