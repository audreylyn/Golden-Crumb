import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Check, Loader2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      // Reset back to idle after showing success message for a while (optional)
      // setTimeout(() => setStatus('idle'), 5000); 
    }, 1500);
  };

  return (
    <footer className="bg-bakery-dark text-bakery-beige pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-3xl font-bold text-white mb-4">The Golden Crumb</h3>
            <p className="font-sans text-bakery-sand max-w-xs mx-auto md:mx-0 leading-relaxed">
              Bringing warmth to your day, one pastry at a time. Baked fresh daily with love and the finest ingredients.
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <h4 className="font-serif text-xl font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3 font-sans">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-right">
            <h4 className="font-serif text-xl font-bold text-white mb-6">Stay in the Loop</h4>
            <div className="flex flex-col items-center md:items-end gap-4">
              <p className="font-sans text-bakery-sand text-sm">Join our newsletter for special offers.</p>
              
              {status === 'success' ? (
                <div className="bg-green-500/20 border border-green-500/30 text-green-100 px-4 py-3 rounded-lg w-full max-w-xs flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <Check size={18} />
                  <span className="font-sans font-medium text-sm">Welcome to the family!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex w-full max-w-xs relative">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email" 
                    disabled={status === 'loading'}
                    className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 w-full disabled:opacity-50 transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-bakery-primary hover:bg-bakery-accent text-white px-4 py-2 rounded-r-lg font-serif font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[80px] flex justify-center items-center"
                  >
                    {status === 'loading' ? <Loader2 size={20} className="animate-spin" /> : 'Join'}
                  </button>
                </form>
              )}
              
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-bakery-sand hover:text-white transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-bakery-sand hover:text-white transition-colors"><Facebook size={24} /></a>
                <a href="#" className="text-bakery-sand hover:text-white transition-colors"><Twitter size={24} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-sans text-bakery-sand">
          <p>&copy; {new Date().getFullYear()} The Golden Crumb Bakery. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};