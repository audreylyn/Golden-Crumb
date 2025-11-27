import React, { useEffect, useState } from 'react';
import { Leaf, Users, ChefHat, Clock, Heart, Award, CheckCircle, Wheat } from 'lucide-react';
import { supabase, getWebsiteId } from '../src/lib/supabase';
import type { WhyChooseUsContent } from '../src/types/database.types';
import { EditableText } from '../src/components/editor/EditableText';
import { useEditor } from '../src/contexts/EditorContext';

// Icon mapping
const iconMap: Record<string, any> = {
  'chef-hat': ChefHat,
  chefhat: ChefHat,
  leaf: Leaf,
  users: Users,
  clock: Clock,
  heart: Heart,
  award: Award,
  'check-circle': CheckCircle,
  wheat: Wheat
};

export const WhyChooseUs: React.FC = () => {
  const [content, setContent] = useState<WhyChooseUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { isEditing, saveField } = useEditor();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const websiteId = await getWebsiteId();
      if (!websiteId) return;

      const { data, error } = await supabase
        .from('why_choose_us_content')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (error) throw error;
      setContent(data as WhyChooseUsContent);
    } catch (error) {
      console.error('Error fetching why choose us content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-bakery-beige relative flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bakery-primary mx-auto mb-4"></div>
          <p className="font-sans text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (!content) return null;

  const reasons = content.reasons as any[] || [];

  return (
    <section className="py-24 bg-bakery-beige relative">
        {/* Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                {content.subheading && (
                  isEditing ? (
                    <EditableText
                      value={content.subheading}
                      onSave={async (newValue) => {
                        await saveField('why_choose_us_content', 'subheading', newValue, content.id);
                        setContent({ ...content, subheading: newValue });
                      }}
                      tag="span"
                      className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block mb-2"
                    />
                  ) : (
                    <span className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block mb-2">
                        {content.subheading}
                    </span>
                  )
                )}
                {isEditing ? (
                  <EditableText
                    value={content.heading}
                    onSave={async (newValue) => {
                      await saveField('why_choose_us_content', 'heading', newValue, content.id);
                      setContent({ ...content, heading: newValue });
                    }}
                    tag="h2"
                    className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mb-4"
                  />
                ) : (
                  <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mb-4">{content.heading}</h2>
                )}
                <div className="w-24 h-1 bg-bakery-primary mx-auto rounded-full mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {reasons.map((reason, index) => {
                  const IconComponent = iconMap[reason.icon] || ChefHat;
                  return (
                    <div key={index} className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-bakery-sand/30 group">
                        <div className="w-20 h-20 bg-bakery-cream rounded-full flex items-center justify-center text-bakery-primary mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                            <IconComponent size={32} strokeWidth={1.5} />
                        </div>
                        {isEditing ? (
                          <EditableText
                            value={reason.title}
                            onSave={async (newValue) => {
                              const updatedReasons = [...reasons];
                              updatedReasons[index] = { ...updatedReasons[index], title: newValue };
                              await saveField('why_choose_us_content', 'reasons', updatedReasons, content.id);
                              setContent({ ...content, reasons: updatedReasons as any });
                            }}
                            tag="h3"
                            className="font-serif text-2xl font-bold text-bakery-dark mb-4 text-center group-hover:text-bakery-primary transition-colors"
                          />
                        ) : (
                          <h3 className="font-serif text-2xl font-bold text-bakery-dark mb-4 text-center group-hover:text-bakery-primary transition-colors">{reason.title}</h3>
                        )}
                        {isEditing ? (
                          <EditableText
                            value={reason.description}
                            onSave={async (newValue) => {
                              const updatedReasons = [...reasons];
                              updatedReasons[index] = { ...updatedReasons[index], description: newValue };
                              await saveField('why_choose_us_content', 'reasons', updatedReasons, content.id);
                              setContent({ ...content, reasons: updatedReasons as any });
                            }}
                            tag="p"
                            multiline
                            className="font-sans text-gray-600 text-center leading-relaxed"
                          />
                        ) : (
                          <p className="font-sans text-gray-600 text-center leading-relaxed">
                              {reason.description}
                          </p>
                        )}
                    </div>
                  );
                })}
            </div>
        </div>
    </section>
  );
};