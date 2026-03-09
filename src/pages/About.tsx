import { motion } from 'motion/react';
import { Users, Target, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-32 pb-20 bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
              Redefining the <br />
              <span className="text-emerald-600">Digital Shopping</span> <br />
              Experience.
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Founded in 2024, OneKart was born out of a simple idea: to create a premium destination where technology meets style. We believe that shopping for electronics and fashion should be as elegant as the products themselves.
            </p>
            <div className="flex items-center space-x-8">
              <div>
                <h4 className="text-3xl font-bold text-gray-900">10k+</h4>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <h4 className="text-3xl font-bold text-gray-900">500+</h4>
                <p className="text-sm text-gray-500">Premium Products</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <h4 className="text-3xl font-bold text-gray-900">24/7</h4>
                <p className="text-sm text-gray-500">Expert Support</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
                alt="Our Team"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-600 rounded-3xl flex items-center justify-center p-8 text-white shadow-xl hidden md:flex">
              <p className="text-lg font-bold leading-tight">Innovation at every step.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              These principles guide everything we do, from product selection to customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Customer First",
                desc: "We prioritize our customers' needs and satisfaction above all else, ensuring a seamless experience from browsing to delivery."
              },
              {
                icon: Target,
                title: "Quality Driven",
                desc: "Every product in our catalog undergoes rigorous quality checks to ensure it meets our high standards of excellence."
              },
              {
                icon: Award,
                title: "Innovation",
                desc: "We constantly embrace new technologies and trends to stay ahead of the curve and provide the best digital shopping experience."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-8">
            Ready to experience the <br />
            <span className="text-emerald-600">future of shopping?</span>
          </h2>
          <Link
            to="/shop"
            className="px-10 py-5 bg-black text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all inline-flex items-center group shadow-xl shadow-black/10"
          >
            Start Shopping Now
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
