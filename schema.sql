-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user' -- 'admin', 'store', 'user'
);

-- Stores Table
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  owner_id VARCHAR(255) REFERENCES users(clerk_id),
  store_name VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255),
  contact_number VARCHAR(50),
  address TEXT,
  logo_url TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  offer_price DECIMAL(10, 2),
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  image_urls TEXT[], -- Array of image URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(clerk_id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount DECIMAL(5, 2) NOT NULL,
  expiry_date DATE NOT NULL
);
