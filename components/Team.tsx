import React from 'react';
import { Heart } from 'lucide-react';

const team = [
  {
    id: 1,
    name: "Eleanor Vance",
    role: "Founder & Head Baker",
    favorite: "Classic Sourdough",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Julian Santos",
    role: "Lead Pâtissier",
    favorite: "Almond Croissant",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Barista Lead",
    favorite: "Oat Milk Latte",
    image: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

export const Team: React.FC = () => {
  return (
    <section className="py-24 bg-bakery-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block mb-2">
            The Hands Behind the Dough
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark">
            Meet Our Artisans
          </h2>
          <div className="w-24 h-1 bg-bakery-sand mx-auto rounded-full mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((member) => (
            <div key={member.id} className="group relative">
              {/* Image Card */}
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg mb-6">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bakery-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-bakery-sand font-sans text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    "Baking is about patience and precision. You can't rush perfection."
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-serif text-2xl font-bold text-bakery-dark mb-1">{member.name}</h3>
                <p className="font-sans text-bakery-primary font-bold text-sm tracking-wide uppercase mb-3">{member.role}</p>
                
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-bakery-sand/50">
                  <Heart size={14} className="text-bakery-accent fill-bakery-accent" />
                  <span className="text-xs font-sans text-gray-600">
                    Favorite: <span className="font-bold text-bakery-dark">{member.favorite}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};