import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold tracking-tighter text-black mb-2 block">
            One<span className="text-emerald-600">Kart</span>
          </Link>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Welcome back to OneKart' : 'Join our community and start shopping'}
          </p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 p-2 border border-black/5 overflow-hidden">
          {isLogin ? (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "rounded-2xl border-black/5 hover:bg-gray-50 transition-all",
                  formButtonPrimary: "bg-black hover:bg-emerald-600 transition-all rounded-2xl py-4",
                  formFieldInput: "bg-gray-50 border-transparent rounded-2xl focus:border-emerald-600 transition-all",
                  footerActionLink: "text-emerald-600 font-bold hover:text-emerald-700",
                  identityPreviewText: "text-gray-600",
                  formFieldLabel: "text-gray-700 font-bold",
                }
              }}
              routing="hash"
              signUpUrl="/auth"
            />
          ) : (
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "rounded-2xl border-black/5 hover:bg-gray-50 transition-all",
                  formButtonPrimary: "bg-black hover:bg-emerald-600 transition-all rounded-2xl py-4",
                  formFieldInput: "bg-gray-50 border-transparent rounded-2xl focus:border-emerald-600 transition-all",
                  footerActionLink: "text-emerald-600 font-bold hover:text-emerald-700",
                  formFieldLabel: "text-gray-700 font-bold",
                }
              }}
              routing="hash"
              signInUrl="/auth"
            />
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
