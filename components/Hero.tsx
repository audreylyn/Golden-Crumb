import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/bakery1/1600/900',
    title: 'Baked with Love & Warmth',
    subtitle: 'Artisanal sourdough, flaky croissants, and treats made from scratch daily.',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/pastry2/1600/900',
    title: 'The Scent of Tradition',
    subtitle: 'Experience the comforting aroma of freshly baked goods in a cozy atmosphere.',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/bread3/1600/900',
    title: 'Taste the Difference',
    subtitle: 'Using only the finest locally-sourced organic ingredients.',
  },
];

export const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effect: Moves background down by 30% as we scroll past the section
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="hero" ref={ref} className="relative h-[90vh] overflow-hidden bg-bakery-dark">
      {/* Background with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute -top-[15%] left-0 w-full h-[130%] z-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[current].image})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">
                {slides[current].title}
              </h1>
              <p className="font-sans text-xl md:text-2xl text-bakery-cream mb-8 font-light tracking-wide drop-shadow-sm">
                {slides[current].subtitle}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-bakery-primary hover:bg-bakery-accent text-white font-serif py-3 px-8 rounded-full text-lg shadow-lg transition-colors"
              >
                View Our Menu
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="z-20 absolute inset-0 pointer-events-none">
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};