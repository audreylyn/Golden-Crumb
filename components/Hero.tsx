import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { supabase, getWebsiteId } from '../src/lib/supabase';
import type { HeroContent, HeroSlide } from '../src/types/database.types';
import { EditableText } from '../src/components/editor/EditableText';
import { useEditor } from '../src/contexts/EditorContext';
import { useWebsite } from '../src/contexts/WebsiteContext';

export const Hero: React.FC = () => {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const { isEditing, saveField } = useEditor();
  const { contentVersion } = useWebsite();

  useEffect(() => {
    fetchHeroContent();
  }, [contentVersion]); // Refetch when content version changes

  const fetchHeroContent = async () => {
    try {
      const websiteId = await getWebsiteId();
      if (!websiteId) {
        console.error('No website ID found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (error) throw error;
      setContent(data as HeroContent);
    } catch (error) {
      console.error('Error fetching hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  const slides = content?.slides as HeroSlide[] || [];

  useEffect(() => {
    // Disable autoplay when editing
    if (isEditing || slides.length === 0 || !content?.autoplay) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, content.autoplay_interval || 5000);
    return () => clearInterval(timer);
  }, [slides.length, content?.autoplay, content?.autoplay_interval, isEditing]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const handleImageChange = async (slideIndex: number) => {
    const newImageUrl = prompt('Enter new image URL:', slides[slideIndex].image);
    if (newImageUrl && newImageUrl !== slides[slideIndex].image) {
      try {
        const updatedSlides = [...slides];
        updatedSlides[slideIndex] = { ...updatedSlides[slideIndex], image: newImageUrl };
        await saveField('hero_content', 'slides', updatedSlides, content.id);
        setContent({ ...content, slides: updatedSlides as any });
        alert('Image saved successfully!');
      } catch (error) {
        console.error('Error saving image:', error);
        alert('Failed to save image. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <section id="hero" className="relative h-[90vh] overflow-hidden bg-bakery-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-sans">Loading...</p>
        </div>
      </section>
    );
  }

  if (!content || slides.length === 0) {
    return (
      <section id="hero" className="relative h-[90vh] overflow-hidden bg-bakery-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="font-serif text-2xl">No content available</p>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative h-[90vh] overflow-hidden bg-bakery-dark">
      {/* Background - Parallax removed to fix hydration error */}
      <div 
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
      </div>

      {/* Change Image Button - Outside background div for proper z-index */}
      {isEditing && (
        <div 
          className="absolute bottom-4 left-4 cursor-pointer z-50"
          onClick={() => handleImageChange(current)}
          title="Click to change background image"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg hover:bg-white transition-colors border-2 border-blue-500">
            <ImageIcon size={20} className="text-gray-700" />
            <span className="text-gray-700 font-medium text-sm">Change Background Image</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <AnimatePresence mode={isEditing ? false : "wait"}>
            <motion.div
              key={isEditing ? 'editing' : current}
              initial={isEditing ? false : { y: 20, opacity: 0 }}
              animate={isEditing ? {} : { y: 0, opacity: 1 }}
              exit={isEditing ? false : { y: -20, opacity: 0 }}
              transition={isEditing ? {} : { duration: 0.5, delay: 0.2 }}
            >
              {isEditing ? (
                <EditableText
                  value={slides[current].title}
                  onSave={async (newValue) => {
                    const updatedSlides = [...slides];
                    updatedSlides[current] = { ...updatedSlides[current], title: newValue };
                    await saveField('hero_content', 'slides', updatedSlides, content.id);
                    setContent({ ...content, slides: updatedSlides as any });
                  }}
                  tag="h1"
                  className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md"
                />
              ) : (
                <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">
                  {slides[current].title}
                </h1>
              )}
              {isEditing ? (
                <EditableText
                  value={slides[current].subtitle}
                  onSave={async (newValue) => {
                    const updatedSlides = [...slides];
                    updatedSlides[current] = { ...updatedSlides[current], subtitle: newValue };
                    await saveField('hero_content', 'slides', updatedSlides, content.id);
                    setContent({ ...content, slides: updatedSlides as any });
                  }}
                  tag="p"
                  multiline
                  className="font-sans text-xl md:text-2xl text-white mb-8 font-light tracking-wide drop-shadow-sm"
                />
              ) : (
                <p className="font-sans text-xl md:text-2xl text-bakery-cream mb-8 font-light tracking-wide drop-shadow-sm">
                  {slides[current].subtitle}
                </p>
              )}
              {content.show_button && (
                <motion.a
                  href={content.button_link}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-bakery-primary hover:bg-bakery-accent text-white font-serif py-3 px-8 rounded-full text-lg shadow-lg transition-colors"
                >
                  {isEditing ? (
                    <EditableText
                      value={content.button_text}
                      onSave={async (newValue) => {
                        await saveField('hero_content', 'button_text', newValue, content.id);
                        setContent({ ...content, button_text: newValue });
                      }}
                      tag="span"
                      className="font-serif"
                    />
                  ) : (
                    content.button_text
                  )}
                </motion.a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      {content.show_navigation && slides.length > 1 && (
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
      )}

      {/* Indicators */}
      {content.show_indicators && slides.length > 1 && (
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
      )}
    </section>
  );
};