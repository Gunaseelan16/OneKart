import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4 block"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight text-gray-900 mb-6"
          >
            We'd Love to Hear From You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto"
          >
            Have a question about our products, shipping, or anything else? Our team is here to help you 24/7.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {[
              { icon: Mail, title: "Email Us", detail: "support@onekart.com", sub: "Response within 24 hours" },
              { icon: Phone, title: "Call Us", detail: "+1 (555) 000-1234", sub: "Mon-Fri, 9am-6pm EST" },
              { icon: MapPin, title: "Visit Us", detail: "123 Commerce St, Digital City", sub: "DC 10101, United States" }
            ].map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start space-x-5 p-6 rounded-3xl bg-gray-50 border border-black/5 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <info.icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{info.title}</h4>
                  <p className="text-sm text-gray-900 font-medium mb-1">{info.detail}</p>
                  <p className="text-xs text-gray-500">{info.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="pt-8 border-t border-black/5">
              <h4 className="font-bold text-gray-900 mb-6">Follow Our Journey</h4>
              <div className="flex items-center space-x-4">
                {['Facebook', 'Instagram', 'Twitter', 'Youtube'].map((social) => (
                  <a key={social} href="#" className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-[40px] border border-black/5 shadow-2xl shadow-black/5"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center"
                >
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-900 mb-2">Message Sent!</h4>
                  <p className="text-emerald-700">Thank you for reaching out. We'll get back to you shortly.</p>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition-all resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center group"
                  >
                    Send Message
                    <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
