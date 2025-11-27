import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Do you offer gluten-free or vegan options?",
    answer: "Yes! We bake a fresh batch of gluten-free muffins and bread daily. We also have a selection of vegan pastries, including our popular cinnamon rolls and fruit tarts."
  },
  {
    question: "Can I place a custom order for a cake?",
    answer: "Absolutely. We require at least 48 hours' notice for custom cake orders. Please fill out the contact form or give us a call to discuss your specific requirements."
  },
  {
    question: "Do you deliver?",
    answer: "We offer local delivery within a 5-mile radius for orders over ₱500. You can also order through our delivery partners like GrabFood and FoodPanda."
  },
  {
    question: "Are pets allowed in the bakery?",
    answer: "We love our furry friends! We have a pet-friendly outdoor patio where you can enjoy your coffee and pastries with your dog."
  },
  {
    question: "Do you have Wi-Fi?",
    answer: "Yes, we offer free high-speed Wi-Fi for our customers. It's the perfect spot to get some work done while enjoying a fresh brew."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2 text-bakery-primary">
            <HelpCircle size={24} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-bakery-dark">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-1 bg-bakery-sand mx-auto rounded-full mt-4" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-bakery-sand/30 rounded-xl overflow-hidden bg-bakery-cream/20"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-bakery-cream/50 transition-colors"
              >
                <span className="font-serif font-bold text-lg text-bakery-dark">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-bakery-primary"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-5 pt-0 text-gray-600 font-sans leading-relaxed border-t border-bakery-sand/20">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};