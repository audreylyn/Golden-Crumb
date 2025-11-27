import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Local Foodie",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "The almond croissants are simply divine! The layers are perfectly flaky, and the filling is not too sweet. It reminds me of my trip to Paris last summer.",
    stars: 5
  },
  {
    id: 2,
    name: "Michael Ross",
    role: "Regular Customer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "Best sourdough in the city, hands down. The crust has that perfect crunch and the interior is soft and airy. The staff is always so welcoming and warm.",
    stars: 5
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Coffee Lover",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "A cozy little gem in the neighborhood. I start every Sunday morning here with a latte and a cinnamon roll. It's my happy place.",
    stars: 5
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Pastry Chef",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "As a chef myself, I appreciate the technique that goes into their laminations. The pain au chocolat is technically perfect.",
    stars: 5
  },
  {
    id: 5,
    name: "Linda Martinez",
    role: "Event Planner",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "We ordered 50 cupcakes for a corporate event and they were gone in minutes. The presentation was beautiful and the taste was even better.",
    stars: 5
  }
];

export const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // Handle responsive visible cards
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCards);

  const nextSlide = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-24 bg-bakery-dark text-bakery-beige relative overflow-hidden">
      {/* Decorative subtle overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Words from the Warmth
          </h2>
          <div className="w-24 h-1 bg-bakery-accent mx-auto rounded-full mb-6" />
          <p className="text-bakery-sand/80 font-sans text-lg max-w-2xl mx-auto">
            Nothing makes us happier than seeing our customers smile. Here's what our community has to say.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              initial={false}
              animate={{ x: `-${index * (100 / visibleCards)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 relative hover:bg-white/10 transition-colors duration-300 h-full flex flex-col">
                    {/* Changed Quote Color to bakery-accent based on request */}
                    <Quote className="absolute top-6 right-6 text-bakery-accent opacity-60" size={48} />
                    
                    <div className="flex gap-1 mb-6 text-bakery-accent">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                    </div>

                    <p className="font-serif text-lg italic text-white/90 mb-8 leading-relaxed flex-grow">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-bakery-primary"
                      />
                      <div>
                        <h4 className="font-bold font-sans text-white">{testimonial.name}</h4>
                        <p className="text-sm text-bakery-sand">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controls */}
          <button 
            onClick={prevSlide}
            disabled={index === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all disabled:opacity-30 disabled:cursor-not-allowed z-20 ${index === 0 ? 'hidden' : 'block'}`}
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={index === maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all disabled:opacity-30 disabled:cursor-not-allowed z-20 ${index === maxIndex ? 'hidden' : 'block'}`}
            aria-label="Next testimonials"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === idx ? 'w-8 bg-bakery-accent' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};