import React, { useState, useEffect } from 'react';
import { Menu, X, Croissant, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  cartItemCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, cartItemCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className={`p-2 rounded-full transition-colors duration-300 ${scrolled ? 'bg-bakery-primary text-white' : 'bg-white text-bakery-primary'}`}>
              <Croissant size={24} />
            </div>
            <span className={`font-serif text-2xl font-bold tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-bakery-dark' : 'text-white drop-shadow-md'
            }`}>
              The Golden Crumb
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-sans font-medium text-lg tracking-wide transition-colors duration-300 ${
                  scrolled 
                    ? 'text-bakery-dark hover:text-bakery-primary' 
                    : 'text-white/90 hover:text-white drop-shadow-sm'
                }`}
              >
                {link.name}
              </a>
            ))}
            
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-serif transition-all duration-300 shadow-lg group relative ${
                scrolled
                  ? 'bg-bakery-dark text-white hover:bg-bakery-primary'
                  : 'bg-white text-bakery-dark hover:bg-bakery-sand'
              }`}
            >
              <ShoppingCart size={20} />
              <span className="font-bold">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onOpenCart}
              className={`relative p-2 rounded-full transition-colors ${
                 scrolled ? 'bg-bakery-dark text-white' : 'bg-white text-bakery-dark'
              }`}
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors duration-300 ${
                scrolled ? 'text-bakery-dark hover:text-bakery-primary' : 'text-white hover:text-bakery-sand'
              }`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bakery-cream shadow-lg border-t border-bakery-sand animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-medium text-bakery-dark hover:text-bakery-primary hover:bg-bakery-beige rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};