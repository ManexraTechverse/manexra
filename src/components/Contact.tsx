import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send, Facebook, Twitter, Instagram, Linkedin, CheckCircle2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Course Enrollment',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const path = 'contact_messages';
    try {
      await addDoc(collection(db, path), {
        ...formState,
        submittedAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormState({ name: '', email: '', subject: 'Course Enrollment', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">Get In Touch</h2>
            <div className="w-20 h-1 bg-ai-primary rounded-full mb-8" />
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Have a project in mind or want to enroll in a course? Reach out to us and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="text-ai-primary w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">Our Address</div>
                  <div className="text-gray-500">Bhigwan road shiva nagar baramati, maharashtra 413133</div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="text-ai-primary w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">Phone Number</div>
                  <div className="text-gray-500">8237935709</div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="text-ai-primary w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">Email Address</div>
                  <div className="text-gray-500">manexratechverse@gmail.com</div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-ai-primary hover:text-white transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100"
          >
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-ai-primary outline-none transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-ai-primary outline-none transition-colors" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                  <select 
                    value={formState.subject}
                    onChange={e => setFormState({...formState, subject: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-ai-primary outline-none transition-colors appearance-none"
                  >
                    <option>Course Enrollment</option>
                    <option>Service Inquiry</option>
                    <option>Job Application</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                  <textarea 
                    required
                    rows={4} 
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-ai-primary outline-none transition-colors resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-ai-primary text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
