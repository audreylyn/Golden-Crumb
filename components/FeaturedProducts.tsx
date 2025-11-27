import React from 'react';
import { MenuItem } from '../types';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';

// Selected items to feature - IDs match those in Menu.tsx for cart consistency
const featuredItems: MenuItem[] = [
  {
    id: 7,
    name: 'Carrot Cake',
    description: 'Moist spiced cake with crushed carrots and walnuts, topped with cream cheese frosting.',
    price: 250,
    category: 'cake',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Sourdough Loaf',
    description: 'Rustic crust with a soft, airy interior. Fermented for 48 hours.',
    price: 350,
    category: 'bread',
    image: 'https://picsum.photos/seed/sourdough/800/800'
  },
  {
    id: 4,
    name: 'Berry Tart',
    description: 'Fresh seasonal berries atop a vanilla custard and almond tart shell.',
    price: 280,
    category: 'pastry',
    image: 'https://picsum.photos/seed/tart/800/800'
  }
];

interface FeaturedProductsProps {
  addToCart: (item: MenuItem) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ addToCart }) => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
             <span className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block mb-2">
              Curated Selections
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark">
              Chef's Favorites
            </h2>
          </div>
          <div className="flex items-center gap-2 text-bakery-dark/70 font-sans font-medium hover:text-bakery-primary transition-colors cursor-pointer group">
             <span>See all categories</span>
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {featuredItems.map((item) => (
             <div key={item.id} className="group flex flex-col h-full">
                {/* Image Container */}
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden mb-6 relative shadow-md hover:shadow-xl transition-all duration-500">
                   <img 
                     src={item.image} 
                     alt={item.name}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   
                   {/* Badge */}
                   <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                      <Star size={14} className="text-bakery-accent fill-bakery-accent" />
                      <span className="text-xs font-bold font-sans text-bakery-dark tracking-wide uppercase">Top Pick</span>
                   </div>
                   
                   {/* Hover Overlay & Button */}
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   
                   <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full bg-white text-bakery-dark font-serif font-bold py-3.5 rounded-xl shadow-lg hover:bg-bakery-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        Add to Order
                      </button>
                   </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-2xl font-bold text-bakery-dark group-hover:text-bakery-primary transition-colors">
                        {item.name}
                    </h3>
                    <span className="font-serif text-xl font-bold text-bakery-accent">
                        ₱{item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};