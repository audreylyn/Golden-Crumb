import React from 'react';
import { Heart, Wheat, Clock, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-bakery-cream rounded-bl-full -z-10 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bakery-beige rounded-tr-full -z-10 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          {/* Image Collage */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10">
                <img 
                  src="https://lanecove.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2016/05/04233634/bakers-delight-goods.jpg" 
                  alt="Baker kneading dough" 
                  className="rounded-lg shadow-2xl w-[85%] border-4 border-white"
                />
            </div>
            <div className="absolute -bottom-10 -right-4 z-20 w-[60%]">
                <img 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Fresh loaves" 
                  className="rounded-lg shadow-xl border-4 border-white"
                />
            </div>
            {/* Badge */}
            <div className="absolute top-10 -left-6 z-30 bg-bakery-primary text-white p-6 rounded-full shadow-lg flex flex-col items-center justify-center h-28 w-28 text-center animate-bounce-slow transform hover:scale-105 transition-transform">
                <span className="font-serif font-bold text-2xl">35+</span>
                <span className="text-xs font-sans uppercase tracking-wider">Years</span>
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <span className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm">Since 1985</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mt-3 mb-6">
              A Legacy of Warmth & Flavor
            </h2>
            <p className="font-sans text-lg text-gray-600 mb-6 leading-relaxed">
              The Golden Crumb began on a snowy morning in 1985 with a simple dream: to share the comforting aroma of rustic European baking with our community. Founder Eleanor "Ellie" Vance believed that a warm loaf of bread could mend even the coldest of days, and we still live by that philosophy today.
            </p>
            <p className="font-sans text-lg text-gray-600 mb-8 leading-relaxed">
              Three generations later, our ovens haven't gone cold. We remain committed to the slow food movement—using only organic, locally-milled grains and a 60-year-old wild yeast starter. Every croissant is laminated by hand, and every loaf is given the time it needs to rise to perfection.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <div className="text-bakery-primary">
                        <Wheat size={32} strokeWidth={1.5} />
                    </div>
                    <h4 className="font-serif font-bold text-bakery-dark text-lg">Organic Ingredients</h4>
                    <p className="text-sm text-gray-500 font-sans">Sourced from local farms we trust and know by name.</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-bakery-primary">
                        <Heart size={32} strokeWidth={1.5} />
                    </div>
                    <h4 className="font-serif font-bold text-bakery-dark text-lg">Made with Love</h4>
                    <p className="text-sm text-gray-500 font-sans">Handcrafted daily in small batches, never rushed.</p>
                </div>
            </div>

            <button className="border-b-2 border-bakery-primary text-bakery-dark font-serif font-bold text-lg pb-1 hover:text-bakery-primary transition-colors">
              Read Our Full Story
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};