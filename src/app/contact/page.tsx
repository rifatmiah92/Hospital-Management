'use client';

import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Get in Touch</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Contact & Emergency Helpdesk</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our team is available 24/7 to assist with emergency ambulance dispatch, appointment booking, and diagnostic test inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl sm:rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-rose-500/20 text-rose-400 rounded-2xl">
                <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
              </div>
              <div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase">24/7 Emergency Hotline</div>
                <div className="text-lg sm:text-xl font-extrabold text-teal-400">10666 / 09666-700700</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 border-t border-slate-800 pt-2">
              For cardiac emergencies, stroke resuscitation, and immediate ambulance booking.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Banani Hospital Branch</h4>
                <p className="text-xs text-slate-600">Plot 42, Road 11, Block D, Banani, Dhaka-1213</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t pt-3 border-slate-100">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dhanmondi Hospital Branch</h4>
                <p className="text-xs text-slate-600">House 12, Road 5, Dhanmondi, Dhaka-1205</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t pt-3 border-slate-100">
              <Mail className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Email Desk</h4>
                <p className="text-xs text-slate-600">care@careplusmedical.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Send an Inquiry or Feedback</h3>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Message Sent Successfully!</h4>
              <p className="text-xs text-slate-600">Our patient relation team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01700000000"
                    className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="yourname@gmail.com"
                  className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-xl shadow-md transition-all w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
