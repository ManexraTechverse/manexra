import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
}

export default function EnrollmentModal({ isOpen, onClose, courseName }: EnrollmentModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    course: courseName || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const path = 'enrollments';
    try {
      await addDoc(collection(db, path), {
        ...formState,
        submittedAt: serverTimestamp()
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormState({ name: '', email: '', phone: '', address: '', course: courseName || '' });
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>

            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Successful!</h3>
                <p className="text-gray-500">We have received your application. Our team will contact you shortly.</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Enroll Now</h2>
                  <p className="text-gray-500">Join our community and start your learning journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                      <input 
                        required
                        type="email" 
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary transition-colors" 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Mobile Number</label>
                      <input 
                        required
                        type="tel" 
                        value={formState.phone}
                        onChange={e => setFormState({...formState, phone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary transition-colors" 
                        placeholder="8237935709" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Address</label>
                    <textarea 
                      required
                      rows={2}
                      value={formState.address}
                      onChange={e => setFormState({...formState, address: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary transition-colors resize-none" 
                      placeholder="Enter your full address" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Interested Course</label>
                    <input 
                      required
                      type="text" 
                      value={formState.course}
                      onChange={e => setFormState({...formState, course: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary transition-colors" 
                      placeholder="e.g. Full Stack Development" 
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full py-4 bg-ai-primary text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Enrollment'} <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
