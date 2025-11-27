import React, { useState } from 'react';
import { ContactFormState, FormErrors } from '../types';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-bakery-dark mb-6">
                Visit Us
              </h2>
              <p className="text-lg text-gray-600 font-sans leading-relaxed">
                We'd love to see you! Stop by for a coffee and a fresh pastry, or send us a message to place a custom order for your special event.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-bakery-cream p-3 rounded-full text-bakery-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-bakery-dark">Location</h3>
                  <p className="text-gray-600 font-sans">123 Baker Street<br />Culinary District, FL 33101</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bakery-cream p-3 rounded-full text-bakery-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-bakery-dark">Hours</h3>
                  <p className="text-gray-600 font-sans">Mon - Fri: 7:00 AM - 7:00 PM<br />Sat - Sun: 8:00 AM - 5:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bakery-cream p-3 rounded-full text-bakery-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-bakery-dark">Contact</h3>
                  <p className="text-gray-600 font-sans">(555) 123-4567<br />hello@goldencrumb.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-bakery-cream p-8 md:p-10 rounded-2xl shadow-lg border border-bakery-sand">
            <h3 className="font-serif text-3xl font-bold text-bakery-dark mb-6">Send a Message</h3>
            
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center">
                <span className="font-sans font-medium">Thank you! Your message has been sent.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-bakery-dark mb-1 font-serif">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                        : 'border-bakery-sand focus:ring-bakery-primary/30 focus:border-bakery-primary'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500 font-sans">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-bakery-dark mb-1 font-serif">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                        : 'border-bakery-sand focus:ring-bakery-primary/30 focus:border-bakery-primary'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500 font-sans">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-bakery-dark mb-1 font-serif">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                    errors.subject 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                      : 'border-bakery-sand focus:ring-bakery-primary/30 focus:border-bakery-primary'
                  }`}
                  placeholder="Catering Inquiry"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500 font-sans">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-bakery-dark mb-1 font-serif">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                    errors.message 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                      : 'border-bakery-sand focus:ring-bakery-primary/30 focus:border-bakery-primary'
                  }`}
                  placeholder="Tell us what you're craving..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-500 font-sans">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-serif font-bold text-white text-lg shadow-md transition-all flex items-center justify-center space-x-2 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-bakery-primary hover:bg-bakery-dark hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};