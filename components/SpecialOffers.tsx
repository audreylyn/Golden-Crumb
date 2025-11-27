import React from 'react';
import { Tag, Clock, ArrowRight } from 'lucide-react';

export const SpecialOffers: React.FC = () => {
  return (
    <section className="py-24 bg-bakery-primary/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-bakery-accent/10 rounded-br-full -z-10 opacity-50" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-bakery-primary/10 rounded-tl-full -z-10 opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="font-sans font-bold text-bakery-accent tracking-widest uppercase text-sm block mb-2">
                    Limited Time Only
                </span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark">
                    Sweet Deals & Treats
                </h2>
                <div className="w-24 h-1 bg-bakery-sand mx-auto rounded-full mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Offer 1 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-xl h-96 cursor-pointer">
                    <img 
                        src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Breakfast Bundle" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bakery-dark/95 via-bakery-dark/40 to-transparent flex flex-col justify-end p-8 text-white">
                        <div className="bg-bakery-accent w-fit px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 flex items-center gap-1 shadow-sm">
                            <Clock size={12} />
                            Daily 7am - 9am
                        </div>
                        <h3 className="font-serif text-3xl font-bold mb-2">The Early Bird Bundle</h3>
                        <p className="font-sans text-bakery-sand mb-6 max-w-sm">Start your day right with a fresh butter croissant and a medium cappuccino.</p>
                        <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-auto">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300 line-through">₱320</span>
                                <span className="font-serif text-2xl font-bold text-white">₱250</span>
                            </div>
                            <button className="bg-white text-bakery-dark px-6 py-2.5 rounded-full font-bold text-sm hover:bg-bakery-sand transition-colors flex items-center gap-2 shadow-lg group-hover:shadow-white/20">
                                Claim Deal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Offer 2 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-xl h-96 cursor-pointer">
                    <img 
                        src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Weekend Box" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bakery-dark/95 via-bakery-dark/40 to-transparent flex flex-col justify-end p-8 text-white">
                        <div className="bg-bakery-primary w-fit px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 flex items-center gap-1 shadow-sm">
                            <Tag size={12} />
                            Weekends Only
                        </div>
                        <h3 className="font-serif text-3xl font-bold mb-2">Family Weekend Box</h3>
                        <p className="font-sans text-bakery-sand mb-6 max-w-sm">A curated selection of 12 assorted pastries. Perfect for sharing (or not).</p>
                        <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-auto">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300">Save 20%</span>
                                <span className="font-serif text-2xl font-bold text-white">₱1,200</span>
                            </div>
                            <button className="bg-white text-bakery-dark px-6 py-2.5 rounded-full font-bold text-sm hover:bg-bakery-sand transition-colors flex items-center gap-2 shadow-lg group-hover:shadow-white/20">
                                Order Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                 <p className="text-bakery-dark/60 font-sans italic text-sm">
                    *Offers valid while supplies last. Cannot be combined with other discounts.
                </p>
            </div>
        </div>
    </section>
  );
};