import React, { useState } from 'react';
import { MenuItem } from '../types';
import { ShoppingBag, Eye, X, Star } from 'lucide-react';

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Classic Croissant',
    description: 'Buttery, flaky, and golden brown layers baked to perfection.',
    price: 180,
    category: 'pastry',
    image: 'https://picsum.photos/seed/croissant/400/300'
  },
  {
    id: 2,
    name: 'Sourdough Loaf',
    description: 'Rustic crust with a soft, airy interior. Fermented for 48 hours.',
    price: 350,
    category: 'bread',
    image: 'https://picsum.photos/seed/sourdough/400/300'
  },
  {
    id: 3,
    name: 'Cinnamon Roll',
    description: 'Soft dough swirled with cinnamon sugar and topped with cream cheese frosting.',
    price: 220,
    category: 'pastry',
    image: 'https://picsum.photos/seed/cinnamon/400/300'
  },
  {
    id: 4,
    name: 'Berry Tart',
    description: 'Fresh seasonal berries atop a vanilla custard and almond tart shell.',
    price: 280,
    category: 'pastry',
    image: 'https://picsum.photos/seed/tart/400/300'
  },
  {
    id: 5,
    name: 'Baguette',
    description: 'Traditional French stick with a crisp crust and chewy crumb.',
    price: 120,
    category: 'bread',
    image: 'https://picsum.photos/seed/baguette/400/300'
  },
  {
    id: 6,
    name: 'Pain au Chocolat',
    description: 'Classic pastry dough wrapped around two sticks of dark chocolate.',
    price: 190,
    category: 'pastry',
    image: 'https://picsum.photos/seed/chocolat/400/300'
  },
  {
    id: 7,
    name: 'Carrot Cake',
    description: 'Moist spiced cake with crushed carrots and walnuts, topped with cream cheese frosting.',
    price: 250,
    category: 'cake',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    name: 'Cappuccino',
    description: 'Rich espresso with equal parts steamed milk and milk foam.',
    price: 140,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80'
  }
];

const categories = ['all', 'pastry', 'bread', 'cake', 'beverage'];

interface MenuProps {
  addToCart: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddClick = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <section id="menu" className="py-20 bg-bakery-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mb-4">
            Our Daily Selection
          </h2>
          <div className="w-24 h-1 bg-bakery-primary mx-auto rounded-full" />
          <p className="mt-4 text-bakery-dark/80 font-sans text-lg max-w-2xl mx-auto">
            Freshly baked every morning using traditional methods and organic ingredients.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-serif font-bold text-lg capitalize transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-bakery-primary text-white shadow-md transform scale-105'
                  : 'bg-white text-bakery-dark border border-bakery-sand hover:border-bakery-primary hover:text-bakery-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid without Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-bakery-sand/30"
            >
              <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Category Badge */}
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold font-sans uppercase tracking-wider text-bakery-dark shadow-sm">
                  {item.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-2xl font-bold text-bakery-dark group-hover:text-bakery-primary transition-colors cursor-pointer" onClick={() => setSelectedItem(item)}>
                    {item.name}
                  </h3>
                  <span className="font-sans font-bold text-xl text-bakery-accent whitespace-nowrap">
                    ₱{item.price}
                  </span>
                </div>
                
                <p className="text-gray-600 font-sans text-sm leading-relaxed mb-6 flex-grow border-b border-bakery-sand/20 pb-4">
                  {item.description}
                </p>

                <div className="flex gap-3 mt-auto">
                   <button 
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 border-bakery-sand text-bakery-dark font-sans font-bold text-sm hover:border-bakery-primary hover:bg-bakery-primary hover:text-white transition-all duration-300"
                  >
                    <Eye size={18} />
                    View
                  </button>
                  <button 
                    onClick={(e) => handleAddClick(item, e)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-bakery-dark text-white font-sans font-bold text-sm hover:bg-bakery-accent shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <ShoppingBag size={18} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="inline-block border-2 border-bakery-dark text-bakery-dark font-serif font-bold py-3 px-10 rounded-full hover:bg-bakery-dark hover:text-white transition-all duration-300 text-lg shadow-sm hover:shadow-md">
            View Full Menu
          </button>
        </div>
      </div>

      {/* Product Detail Modal without Animation */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-bakery-dark hover:bg-white hover:text-red-500 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-full relative">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 flex flex-col justify-center bg-bakery-cream/30">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-bakery-primary/10 text-bakery-primary text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                    {selectedItem.category}
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-bakery-dark mb-2">
                    {selectedItem.name}
                  </h3>
                  <div className="flex items-center gap-1 text-bakery-accent mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill="currentColor" />
                    ))}
                    <span className="text-gray-500 text-sm font-sans ml-2">(24 reviews)</span>
                  </div>
                </div>

                <p className="text-gray-600 font-sans leading-relaxed mb-6">
                  {selectedItem.description}
                </p>

                <div className="flex items-center justify-between mb-8 pt-6 border-t border-bakery-sand/50">
                  <span className="font-serif text-3xl font-bold text-bakery-dark">
                    ₱{selectedItem.price}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="w-full py-3.5 bg-bakery-primary text-white rounded-xl font-serif font-bold text-lg hover:bg-bakery-dark hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};