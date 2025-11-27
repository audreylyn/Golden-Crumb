import React, { useEffect, useState } from 'react';
import { Heart, Wheat, Clock, Award, CheckCircle, Users, Leaf } from 'lucide-react';
import { supabase, getWebsiteId } from '../src/lib/supabase';
import type { AboutContent } from '../src/types/database.types';
import { EditableText } from '../src/components/editor/EditableText';
import { useEditor } from '../src/contexts/EditorContext';

// Icon mapping
const iconMap: Record<string, any> = {
  heart: Heart,
  wheat: Wheat,
  clock: Clock,
  award: Award,
  'check-circle': CheckCircle,
  users: Users,
  leaf: Leaf
};

export const About: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { isEditing, saveField } = useEditor();

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const websiteId = await getWebsiteId();
      if (!websiteId) return;

      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (error) throw error;
      setContent(data as AboutContent);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className="py-24 bg-white relative overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bakery-primary mx-auto mb-4"></div>
          <p className="font-sans text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (!content) return null;

  const features = content.features as any[] || [];
  const stats = content.stats as any[] || [];

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
                  src={content.image_url || "https://lanecove.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2016/05/04233634/bakers-delight-goods.jpg"} 
                  alt={content.heading} 
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
            {stats.length > 0 && (
              <div className="absolute top-10 -left-6 z-30 bg-bakery-primary text-white p-6 rounded-full shadow-lg flex flex-col items-center justify-center h-28 w-28 text-center animate-bounce-slow transform hover:scale-105 transition-transform">
                  <span className="font-serif font-bold text-2xl">{stats[0].value}</span>
                  <span className="text-xs font-sans uppercase tracking-wider">{stats[0].label}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            {content.subheading && (
              isEditing ? (
                <EditableText
                  value={content.subheading}
                  onSave={async (newValue) => {
                    await saveField('about_content', 'subheading', newValue, content.id);
                    setContent({ ...content, subheading: newValue });
                  }}
                  tag="span"
                  className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block"
                />
              ) : (
                <span className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm">{content.subheading}</span>
              )
            )}
            {isEditing ? (
              <EditableText
                value={content.heading}
                onSave={async (newValue) => {
                  await saveField('about_content', 'heading', newValue, content.id);
                  setContent({ ...content, heading: newValue });
                }}
                tag="h2"
                className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mt-3 mb-6"
              />
            ) : (
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mt-3 mb-6">
                {content.heading}
              </h2>
            )}
            {isEditing ? (
              <EditableText
                value={content.description}
                onSave={async (newValue) => {
                  await saveField('about_content', 'description', newValue, content.id);
                  setContent({ ...content, description: newValue });
                }}
                tag="p"
                multiline
                className="font-sans text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line"
              />
            ) : (
              <p className="font-sans text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                {content.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || Heart;
                  return (
                    <div key={index} className="flex flex-col gap-2">
                        <div className="text-bakery-primary">
                            <IconComponent size={32} strokeWidth={1.5} />
                        </div>
                        <h4 className="font-serif font-bold text-bakery-dark text-lg">{feature.title}</h4>
                        <p className="text-sm text-gray-500 font-sans">{feature.description}</p>
                    </div>
                  );
                })}
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