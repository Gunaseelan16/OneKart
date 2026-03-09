import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-black">
            One<span className="text-emerald-600">Kart</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your premium destination for high-quality electronics, fashion, and gadgets. We deliver excellence to your doorstep.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Home</Link></li>
            <li><Link to="/shop" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Shop</Link></li>
            <li><Link to="/categories" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Categories</Link></li>
            <li><Link to="/about" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Contact</Link></li>
            <li><Link to="/create-store" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Create Store</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Support</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Returns & Refunds</a></li>
            <li><a href="#" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-500 hover:text-emerald-600 text-sm transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-gray-500 text-sm">123 Commerce St, Digital City, DC 10101</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-emerald-600 shrink-0" />
              <span className="text-gray-500 text-sm">+1 (555) 000-1234</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-emerald-600 shrink-0" />
              <span className="text-gray-500 text-sm">support@onekart.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} OneKart. All rights reserved.
        </p>
        <div className="flex items-center space-x-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
        </div>
      </div>
    </footer>
  );
}
