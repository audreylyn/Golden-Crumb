import React from 'react';
import { Leaf, Users, ChefHat } from 'lucide-react';

const features = [
  {
    icon: <ChefHat size={32} strokeWidth={1.5} />,
    title: "Artisanal Mastery",
    description: "Every loaf and pastry is hand-crafted using traditional European techniques passed down through generations. We believe in slow fermentation for deep, complex flavors that mass production simply cannot replicate."
  },
  {
    icon: <Leaf size={32} strokeWidth={1.5} />,
    title: "Locally Sourced",
    description: "We partner with local farmers to source organic grains, fresh dairy, and seasonal fruits. From farm to oven, we ensure the highest quality ingredients in every bite while supporting our local agricultural community."
  },
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    title: "Community Heart",
    description: "More than just a bakery, we are a gathering place for neighbors and friends. We proudly support local events, host workshops, and donate our daily surplus to local shelters to ensure nothing goes to waste."
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-bakery-beige relative">
        {/* Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="font-sans font-bold text-bakery-primary tracking-widest uppercase text-sm block mb-2">
                    The Golden Standard
                </span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mb-4">Why Choose Us?</h2>
                <div className="w-24 h-1 bg-bakery-primary mx-auto rounded-full mt-6" />
                <p className="mt-6 text-bakery-dark/80 font-sans text-lg max-w-2xl mx-auto">
                    We don't just bake bread; we craft experiences warmed by the oven and served with a smile. Here is what sets us apart.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {features.map((feature, index) => (
                    <div key={index} className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-bakery-sand/30 group">
                        <div className="w-20 h-20 bg-bakery-cream rounded-full flex items-center justify-center text-bakery-primary mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-bakery-dark mb-4 text-center group-hover:text-bakery-primary transition-colors">{feature.title}</h3>
                        <p className="font-sans text-gray-600 text-center leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};