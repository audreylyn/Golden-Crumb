/**
 * Initialize default website content
 * Called when a new website is created
 */

import { supabase } from './supabase';

export async function initializeWebsiteContent(websiteId: string) {
  try {
    // Initialize navbar content
    await supabase.from('navbar_content').insert({
      website_id: websiteId,
      brand_name: 'My Website',
      brand_logo_url: null,
      show_cart: true,
      sticky_nav: true,
      nav_items: [
        { label: 'Home', href: '#hero', order: 0 },
        { label: 'About', href: '#about', order: 1 },
        { label: 'Menu', href: '#menu', order: 2 },
        { label: 'Contact', href: '#contact', order: 3 }
      ],
      cta_button: {
        text: 'Reserve Table',
        href: '#reservation',
        variant: 'primary'
      }
    });

    // Initialize hero content
    await supabase.from('hero_content').insert({
      website_id: websiteId,
      slides: [
        {
          id: 1,
          title: 'Welcome to Our Website',
          subtitle: 'Discover something amazing',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920'
        }
      ],
      button_text: 'Get Started',
      button_link: '#about',
      show_button: true,
      autoplay: true,
      autoplay_interval: 5000,
      show_navigation: true,
      show_indicators: true,
      parallax_enabled: false
    });

    // Initialize about content
    await supabase.from('about_content').insert({
      website_id: websiteId,
      heading: 'About Us',
      subheading: 'Our Story',
      description: 'We are passionate about delivering excellence.',
      image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'
    });

    // Initialize why choose us content
    await supabase.from('why_choose_us_content').insert({
      website_id: websiteId,
      heading: 'Why Choose Us',
      subheading: 'What Makes Us Special',
      reasons: [
        {
          title: 'Quality Ingredients',
          description: 'We use only the finest ingredients in all our products.',
          icon: 'leaf'
        },
        {
          title: 'Expert Craftsmanship',
          description: 'Our team brings years of experience and passion.',
          icon: 'chef-hat'
        },
        {
          title: 'Customer First',
          description: 'Your satisfaction is our top priority.',
          icon: 'heart'
        }
      ]
    });

    // Initialize contact info
    await supabase.from('contact_info').insert({
      website_id: websiteId,
      heading: 'Contact Us',
      subheading: 'Get in touch',
      address: '123 Main Street',
      city: 'City',
      state: 'State',
      zip_code: '12345',
      phone: '+1 (555) 123-4567',
      email: 'info@example.com'
    });

    // Initialize reservation config
    await supabase.from('reservation_config').insert({
      website_id: websiteId,
      heading: 'Join Us for an Unforgettable Brunch',
      subheading: 'Book a Table',
      description: "Whether it's a quiet morning coffee or a lively weekend brunch with friends, we have the perfect spot for you. Reserve your table in advance to skip the queue.",
      features: [
        {
          icon: 'calendar',
          title: 'Flexible Booking',
          description: 'Book up to 30 days in advance. Cancellation is free up to 2 hours before.'
        },
        {
          icon: 'users',
          title: 'Large Groups',
          description: 'Planning a gathering? We can accommodate groups of up to 12 people.'
        }
      ]
    });

    // Initialize section visibility
    const sections = [
      'hero', 'about', 'why_choose_us', 'menu', 'featured_products',
      'team', 'testimonials', 'faq', 'contact', 'instagram_feed'
    ];

    for (let i = 0; i < sections.length; i++) {
      await supabase.from('website_sections').insert({
        website_id: websiteId,
        section_name: sections[i],
        is_enabled: true,
        display_order: i
      });
    }

    console.log('✅ Website content initialized');
  } catch (error) {
    console.error('Error initializing website content:', error);
    throw error;
  }
}

