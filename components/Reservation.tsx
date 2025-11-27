import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { ReservationFormState } from '../types';

export const Reservation: React.FC = () => {
  const [form, setForm] = useState<ReservationFormState>({
    date: '',
    time: '',
    guests: 2,
    name: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset after 3 seconds for demo
    setTimeout(() => {
      setIsSubmitted(false);
      setForm({ date: '', time: '', guests: 2, name: '', phone: '' });
    }, 5000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="reservations" className="py-24 bg-bakery-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="text-white">
            <span className="font-sans font-bold text-bakery-accent tracking-widest uppercase text-sm mb-2 block">
              Book a Table
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Join Us for an Unforgettable Brunch
            </h2>
            <p className="font-sans text-bakery-sand text-lg mb-8 leading-relaxed">
              Whether it's a quiet morning coffee or a lively weekend brunch with friends, we have the perfect spot for you. Reserve your table in advance to skip the queue.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-lg text-bakery-accent h-fit">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl mb-1">Flexible Booking</h4>
                  <p className="text-bakery-sand/80 font-sans text-sm">Book up to 30 days in advance. Cancellation is free up to 2 hours before.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/10 p-3 rounded-lg text-bakery-accent h-fit">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl mb-1">Large Groups</h4>
                  <p className="text-bakery-sand/80 font-sans text-sm">Planning a gathering? We can accommodate groups of up to 12 people.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            {isSubmitted ? (
              <div className="text-center py-16 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
                <h3 className="font-serif text-3xl font-bold text-bakery-dark mb-4">Reservation Confirmed!</h3>
                <p className="text-gray-600 font-sans mb-2">
                  We look forward to seeing you, <span className="font-bold">{form.name}</span>.
                </p>
                <p className="text-sm text-gray-500">
                  A confirmation has been sent to your phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-bakery-dark mb-2 font-serif">Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        required
                        min={today}
                        value={form.date}
                        onChange={(e) => setForm({...form, date: e.target.value})}
                        className="w-full px-4 py-3 bg-bakery-cream/30 border border-bakery-sand rounded-lg focus:ring-2 focus:ring-bakery-primary/30 focus:border-bakery-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-bakery-dark mb-2 font-serif">Time</label>
                    <div className="relative">
                      <input 
                        type="time" 
                        required
                        min="07:00"
                        max="19:00"
                        value={form.time}
                        onChange={(e) => setForm({...form, time: e.target.value})}
                        className="w-full px-4 py-3 bg-bakery-cream/30 border border-bakery-sand rounded-lg focus:ring-2 focus:ring-bakery-primary/30 focus:border-bakery-primary outline-none transition-all"
                      />
                      <Clock className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-bakery-dark mb-2 font-serif">Number of Guests</label>
                  <select 
                    value={form.guests}
                    onChange={(e) => setForm({...form, guests: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-bakery-cream/30 border border-bakery-sand rounded-lg focus:ring-2 focus:ring-bakery-primary/30 focus:border-bakery-primary outline-none transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                    <option value={11}>10+ (Call us)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-bakery-dark mb-2 font-serif">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-3 bg-bakery-cream/30 border border-bakery-sand rounded-lg focus:ring-2 focus:ring-bakery-primary/30 focus:border-bakery-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-bakery-dark mb-2 font-serif">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-bakery-cream/30 border border-bakery-sand rounded-lg focus:ring-2 focus:ring-bakery-primary/30 focus:border-bakery-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-bakery-primary text-white font-serif font-bold text-lg py-4 rounded-xl hover:bg-bakery-accent transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};