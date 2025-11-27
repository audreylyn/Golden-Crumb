import React from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';

const posts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    alt: "Fresh croissants on a cooling rack",
    likes: 243,
    comments: 18
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80",
    alt: "Baker dusting flour on dough",
    likes: 189,
    comments: 12
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=600&q=80",
    alt: "Artisan sourdough bread loaf",
    likes: 567,
    comments: 45
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&w=600&q=80",
    alt: "Cupcakes with vanilla frosting",
    likes: 321,
    comments: 28
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    alt: "Rustic bread selection",
    likes: 412,
    comments: 36
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    alt: "Morning coffee and pastries",
    likes: 156,
    comments: 9
  }
];

export const InstagramFeed: React.FC = () => {
  return (
    <section className="py-20 bg-bakery-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-bakery-accent">
              <Instagram size={20} />
              <span className="font-bold font-sans tracking-wider text-sm uppercase">@TheGoldenCrumb</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-bakery-dark">
              Follow the Aroma
            </h2>
          </div>
          <a 
            href="#" 
            className="flex items-center gap-2 text-bakery-primary font-bold font-serif border-b-2 border-bakery-primary pb-1 hover:text-bakery-dark transition-colors group"
          >
            <span>View Profile</span>
            <ExternalLink size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={post.image} 
                alt={post.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-bakery-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white backdrop-blur-[2px]">
                <div className="flex items-center gap-2">
                  <Heart size={20} fill="white" />
                  <span className="font-bold font-sans">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} fill="white" />
                  <span className="font-bold font-sans">{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
            <p className="text-bakery-dark/70 font-sans mb-4">Share your moments with us #GoldenCrumbMoments</p>
        </div>

      </div>
    </section>
  );
};