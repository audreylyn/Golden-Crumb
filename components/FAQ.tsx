import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { supabase, getWebsiteId } from '../src/lib/supabase';
import type { FAQ as FAQType, FAQConfig } from '../src/types/database.types';
import { EditableText } from '../src/components/editor/EditableText';
import { useEditor } from '../src/contexts/EditorContext';

export const FAQ: React.FC = () => {
  const [config, setConfig] = useState<FAQConfig | null>(null);
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { isEditing, saveField } = useEditor();

  useEffect(() => {
    fetchFAQData();
  }, []);

  const fetchFAQData = async () => {
    try {
      const websiteId = await getWebsiteId();
      if (!websiteId) return;

      // Fetch config
      const { data: configData, error: configError } = await supabase
        .from('faq_config')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (configError) throw configError;
      setConfig(configData as FAQConfig);

      // Fetch FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .eq('website_id', websiteId)
        .order('display_order');

      if (faqsError) throw faqsError;
      setFaqs(faqsData as FAQType[]);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bakery-primary mx-auto mb-4"></div>
          <p className="font-sans text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (!config || faqs.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2 text-bakery-primary">
            <HelpCircle size={24} />
          </div>
          {isEditing ? (
            <EditableText
              value={config.heading}
              onSave={async (newValue) => {
                await saveField('faq_config', 'heading', newValue, config.id);
                setConfig({ ...config, heading: newValue });
              }}
              tag="h2"
              className="font-serif text-3xl md:text-4xl font-bold text-bakery-dark"
            />
          ) : (
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-bakery-dark">
              {config.heading}
            </h2>
          )}
          {config.subheading && (
            isEditing ? (
              <EditableText
                value={config.subheading}
                onSave={async (newValue) => {
                  await saveField('faq_config', 'subheading', newValue, config.id);
                  setConfig({ ...config, subheading: newValue });
                }}
                tag="p"
                multiline
                className="text-gray-600 mt-2"
              />
            ) : (
              <p className="text-gray-600 mt-2">{config.subheading}</p>
            )
          )}
          <div className="w-16 h-1 bg-bakery-sand mx-auto rounded-full mt-4" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-bakery-sand/30 rounded-xl overflow-hidden bg-bakery-cream/20"
            >
              <button
                onClick={() => !isEditing && toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-bakery-cream/50 transition-colors"
              >
                {isEditing ? (
                  <EditableText
                    value={faq.question}
                    onSave={async (newValue) => {
                      await saveField('faqs', 'question', newValue, faq.id);
                      setFaqs(faqs.map(f => f.id === faq.id ? { ...f, question: newValue } : f));
                    }}
                    tag="span"
                    className="font-serif font-bold text-lg text-bakery-dark"
                  />
                ) : (
                  <span className="font-serif font-bold text-lg text-bakery-dark">
                    {faq.question}
                  </span>
                )}
                {!isEditing && (
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-bakery-primary"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                )}
              </button>

              <AnimatePresence>
                {(openIndex === index || isEditing) && (
                  <motion.div
                    initial={isEditing ? false : { height: 0, opacity: 0 }}
                    animate={isEditing ? {} : { height: "auto", opacity: 1 }}
                    exit={isEditing ? false : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-5 pt-0 text-gray-600 font-sans leading-relaxed border-t border-bakery-sand/20">
                      {isEditing ? (
                        <EditableText
                          value={faq.answer}
                          onSave={async (newValue) => {
                            await saveField('faqs', 'answer', newValue, faq.id);
                            setFaqs(faqs.map(f => f.id === faq.id ? { ...f, answer: newValue } : f));
                          }}
                          tag="p"
                          multiline
                          className="text-gray-600 font-sans leading-relaxed"
                        />
                      ) : (
                        faq.answer
                      )}
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