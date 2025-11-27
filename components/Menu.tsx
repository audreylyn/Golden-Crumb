import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { ShoppingBag, Eye, X, Star } from 'lucide-react';
import { supabase, getWebsiteId } from '../src/lib/supabase';
import type { MenuCategory, MenuItem as DBMenuItem, MenuSectionConfig } from '../src/types/database.types';
import { EditableText } from '../src/components/editor/EditableText';
import { useEditor } from '../src/contexts/EditorContext';

// Adapter to convert DB menu item to UI menu item
const adaptMenuItem = (dbItem: DBMenuItem): MenuItem => ({
  id: parseInt(dbItem.id.slice(0, 8), 16), // Convert UUID to number for cart compatibility
  name: dbItem.name,
  description: dbItem.description || '',
  price: Number(dbItem.price),
  category: dbItem.category_id,
  image: dbItem.image_url || 'https://picsum.photos/seed/item/400/300'
});

interface MenuProps {
  addToCart: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ addToCart }) => {
  const [config, setConfig] = useState<MenuSectionConfig | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dbMenuItems, setDbMenuItems] = useState<DBMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { isEditing, saveField } = useEditor();

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const websiteId = await getWebsiteId();
      if (!websiteId) return;

      // Fetch config
      const { data: configData, error: configError } = await supabase
        .from('menu_section_config')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (configError) throw configError;
      setConfig(configData as MenuSectionConfig);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('website_id', websiteId)
        .eq('is_visible', true)
        .order('display_order');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData as MenuCategory[]);

      // Fetch menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('website_id', websiteId)
        .eq('is_available', true)
        .order('display_order');

      if (itemsError) throw itemsError;
      
      // Store DB items for editing
      setDbMenuItems(itemsData as DBMenuItem[]);
      
      // Convert DB items to UI items
      const adaptedItems = (itemsData as DBMenuItem[]).map(adaptMenuItem);
      setMenuItems(adaptedItems);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddClick = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
  };

  // Helper to get category name from ID
  const getCategoryNameForItem = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || 'Product';
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-bakery-cream relative flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bakery-primary mx-auto mb-4"></div>
          <p className="font-sans text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (!config) return null;

  const categoryNames = ['all', ...categories.map(c => c.id)];
  const getCategoryName = (id: string) => {
    if (id === 'all') return 'All';
    const cat = categories.find(c => c.id === id);
    return cat?.name || id;
  };

  return (
    <section id="menu" className="py-20 bg-bakery-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {isEditing ? (
            <EditableText
              value={config.heading}
              onSave={async (newValue) => {
                await saveField('menu_section_config', 'heading', newValue, config.id);
                setConfig({ ...config, heading: newValue });
              }}
              tag="h2"
              className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mb-4"
            />
          ) : (
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mb-4">
              {config.heading}
            </h2>
          )}
          <div className="w-24 h-1 bg-bakery-primary mx-auto rounded-full" />
          {config.subheading && (
            isEditing ? (
              <EditableText
                value={config.subheading}
                onSave={async (newValue) => {
                  await saveField('menu_section_config', 'subheading', newValue, config.id);
                  setConfig({ ...config, subheading: newValue });
                }}
                tag="p"
                multiline
                className="mt-4 text-bakery-dark/80 font-sans text-lg max-w-2xl mx-auto"
              />
            ) : (
              <p className="mt-4 text-bakery-dark/80 font-sans text-lg max-w-2xl mx-auto">
                {config.subheading}
              </p>
            )
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categoryNames.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-serif font-bold text-lg capitalize transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-bakery-primary text-white shadow-md transform scale-105'
                  : 'bg-white text-bakery-dark border border-bakery-sand hover:border-bakery-primary hover:text-bakery-primary'
              }`}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>

        {/* Grid without Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-bakery-sand/30"
            >
              <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Category Badge */}
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold font-sans uppercase tracking-wider text-bakery-dark shadow-sm">
                  {getCategoryNameForItem(item.category)}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-3">
                  {isEditing ? (
                    <EditableText
                      value={item.name}
                      onSave={async (newValue) => {
                        const dbItem = dbMenuItems.find(db => db.name === item.name);
                        if (dbItem) {
                          await saveField('menu_items', 'name', newValue, dbItem.id);
                          setDbMenuItems(dbMenuItems.map(db => db.id === dbItem.id ? { ...db, name: newValue } : db));
                          setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, name: newValue } : i));
                        }
                      }}
                      tag="h3"
                      className="font-serif text-2xl font-bold text-bakery-dark group-hover:text-bakery-primary transition-colors cursor-pointer"
                    />
                  ) : (
                    <h3 className="font-serif text-2xl font-bold text-bakery-dark group-hover:text-bakery-primary transition-colors cursor-pointer" onClick={() => setSelectedItem(item)}>
                      {item.name}
                    </h3>
                  )}
                  {isEditing ? (
                    <EditableText
                      value={item.price.toString()}
                      onSave={async (newValue) => {
                        const price = parseFloat(newValue) || 0;
                        const dbItem = dbMenuItems.find(db => db.name === item.name);
                        if (dbItem) {
                          await saveField('menu_items', 'price', price, dbItem.id);
                          setDbMenuItems(dbMenuItems.map(db => db.id === dbItem.id ? { ...db, price } : db));
                          setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, price } : i));
                        }
                      }}
                      tag="span"
                      className="font-sans font-bold text-xl text-bakery-accent whitespace-nowrap"
                    />
                  ) : (
                    <span className="font-sans font-bold text-xl text-bakery-accent whitespace-nowrap">
                      ₱{item.price}
                    </span>
                  )}
                </div>
                
                {isEditing ? (
                  <EditableText
                    value={item.description}
                    onSave={async (newValue) => {
                      const dbItem = dbMenuItems.find(db => db.name === item.name);
                      if (dbItem) {
                        await saveField('menu_items', 'description', newValue, dbItem.id);
                        setDbMenuItems(dbMenuItems.map(db => db.id === dbItem.id ? { ...db, description: newValue } : db));
                        setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, description: newValue } : i));
                      }
                    }}
                    tag="p"
                    multiline
                    className="text-gray-600 font-sans text-sm leading-relaxed mb-6 flex-grow border-b border-bakery-sand/20 pb-4"
                  />
                ) : (
                  <p className="text-gray-600 font-sans text-sm leading-relaxed mb-6 flex-grow border-b border-bakery-sand/20 pb-4">
                    {item.description}
                  </p>
                )}

                <div className="flex gap-3 mt-auto">
                   <button 
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 border-bakery-sand text-bakery-dark font-sans font-bold text-sm hover:border-bakery-primary hover:bg-bakery-primary hover:text-white transition-all duration-300"
                  >
                    <Eye size={18} />
                    View
                  </button>
                  <button 
                    onClick={(e) => handleAddClick(item, e)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-bakery-dark text-white font-sans font-bold text-sm hover:bg-bakery-accent shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <ShoppingBag size={18} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="inline-block border-2 border-bakery-dark text-bakery-dark font-serif font-bold py-3 px-10 rounded-full hover:bg-bakery-dark hover:text-white transition-all duration-300 text-lg shadow-sm hover:shadow-md">
            View Full Menu
          </button>
        </div>
      </div>

      {/* Product Detail Modal without Animation */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-bakery-dark hover:bg-white hover:text-red-500 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-full relative">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 flex flex-col justify-center bg-bakery-cream/30">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-bakery-primary/10 text-bakery-primary text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                    {getCategoryNameForItem(selectedItem.category)}
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-bakery-dark mb-2">
                    {selectedItem.name}
                  </h3>
                  <div className="flex items-center gap-1 text-bakery-accent mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill="currentColor" />
                    ))}
                    <span className="text-gray-500 text-sm font-sans ml-2">(24 reviews)</span>
                  </div>
                </div>

                <p className="text-gray-600 font-sans leading-relaxed mb-6">
                  {selectedItem.description}
                </p>

                <div className="flex items-center justify-between mb-8 pt-6 border-t border-bakery-sand/50">
                  <span className="font-serif text-3xl font-bold text-bakery-dark">
                    ₱{selectedItem.price}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="w-full py-3.5 bg-bakery-primary text-white rounded-xl font-serif font-bold text-lg hover:bg-bakery-dark hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};