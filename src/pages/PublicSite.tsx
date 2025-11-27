/**
 * Public Site Page
 * The main public-facing website (moved from App.tsx)
 */

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import { Menu } from '../../components/Menu';
import { Contact } from '../../components/Contact';
import { Footer } from '../../components/Footer';
import { About } from '../../components/About';
import { Team } from '../../components/Team';
import { WhyChooseUs } from '../../components/WhyChooseUs';
import { Testimonials } from '../../components/Testimonials';
import { SpecialOffers } from '../../components/SpecialOffers';
import { FeaturedProducts } from '../../components/FeaturedProducts';
import { InstagramFeed } from '../../components/InstagramFeed';
import { Cart } from '../../components/Cart';
import { Reservation } from '../../components/Reservation';
import { FAQ } from '../../components/FAQ';
import { ChatSupport } from '../../components/ChatSupport';
import { CartItem, MenuItem } from '../types';
import { ConditionalSection } from '../components/ConditionalSection';

export const PublicSite: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-bakery-cream overflow-x-hidden">
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
      />
      
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClear={clearCart}
      />

      <main>
        <ConditionalSection section="hero">
          <Hero />
        </ConditionalSection>
        <ConditionalSection section="about">
          <About />
        </ConditionalSection>
        <ConditionalSection section="whyChooseUs">
          <WhyChooseUs />
        </ConditionalSection>
        <ConditionalSection section="team">
          <Team />
        </ConditionalSection>
        <ConditionalSection section="featuredProducts">
          <FeaturedProducts addToCart={addToCart} />
        </ConditionalSection>
        <ConditionalSection section="menu">
          <Menu addToCart={addToCart} />
        </ConditionalSection>
        <ConditionalSection section="reservation">
          <Reservation />
        </ConditionalSection>
        <ConditionalSection section="testimonials">
          <Testimonials />
        </ConditionalSection>
        <ConditionalSection section="specialOffers">
          <SpecialOffers />
        </ConditionalSection>
        <ConditionalSection section="faq">
          <FAQ />
        </ConditionalSection>
        <ConditionalSection section="contact">
          <Contact />
        </ConditionalSection>
        <ConditionalSection section="instagramFeed">
          <InstagramFeed />
        </ConditionalSection>
      </main>
      <Footer />
      <ChatSupport />
    </div>
  );
};

