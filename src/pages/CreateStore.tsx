import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Store, User, Mail, Phone, MapPin, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '../ToastContext';
import { cn } from '../utils';

export default function CreateStore() {
  const { user } = useUser();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    email: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      setFormData(prev => ({ ...prev, email: user.primaryEmailAddress?.emailAddress || '' }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to create a store', 'error');
      return;
    }
    if (!logo) {
      showToast('Please upload a store logo', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/store/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          logoUrl: logo,
          ...formData
        }),
      });

      if (response.ok) {
        showToast('Your store request has been submitted successfully. Please wait for admin approval.', 'success');
        // Reset form
        setFormData({
          storeName: '',
          description: '',
          email: user.primaryEmailAddress?.emailAddress || '',
          contactNumber: '',
          address: ''
        });
        setLogo(null);
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to submit store application', 'error');
      }
    } catch (error) {
      console.error('Error submitting store application:', error);
      showToast('Failed to submit store application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-6 relative">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-600 mb-10 transition-colors group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
              >
                <Store size={14} />
                Seller Program
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                Grow Your Business with <span className="text-emerald-600">OneKart</span>
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Join thousands of successful sellers on our platform. We provide the tools and audience you need to scale your brand globally.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { title: 'Global Reach', desc: 'Sell to customers worldwide' },
                { title: 'Secure Payments', desc: 'Fast and reliable payouts' },
                { title: 'Seller Tools', desc: 'Advanced analytics & management' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl shadow-black/5 border border-black/5"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Logo Upload */}
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 hover:border-emerald-500 transition-all group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Store Logo</label>
                  <div 
                    className={cn(
                      "w-24 h-24 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden relative",
                      logo ? "border-emerald-500 bg-white shadow-xl" : "border-gray-200 bg-white group-hover:border-emerald-500"
                    )}
                  >
                    {logo ? (
                      <>
                        <img src={logo} alt="Logo Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload size={20} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={20} className="text-gray-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-300 group-hover:text-emerald-500 uppercase tracking-widest transition-colors">Upload</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <p className="text-[10px] text-gray-400 mt-4">PNG, JPG up to 2MB</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Store Name */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Store Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Store size={18} />
                      </div>
                      <input
                        type="text"
                        name="storeName"
                        required
                        placeholder="My Awesome Store"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 text-gray-400">
                      <FileText size={18} />
                    </div>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      placeholder="Tell us about your store..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="store@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Contact Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        name="contactNumber"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Address</label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="Enter your store address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium text-sm resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
