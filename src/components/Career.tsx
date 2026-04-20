import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, GraduationCap, ArrowUpRight, X, User, Mail, Phone, FileText, Send, MapPin, Clock, CheckCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Career() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    experience: '',
    message: ''
  });

  useEffect(() => {
    const q = query(
      collection(db, 'jobs'), 
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const allJobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(allJobs.filter((job: any) => job.isActive));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'jobs'));

    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'job_applications'), {
        ...formData,
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        submittedAt: serverTimestamp()
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowApplyModal(false);
        setSelectedJob(null);
        setFormData({ name: '', email: '', phone: '', resumeUrl: '', experience: '', message: '' });
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'job_applications');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="career" className="py-24 bg-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ai-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ai-secondary/5 blur-[120px] rounded-full -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-display font-bold mb-4">Join Our Team</h2>
              <div className="w-20 h-1.5 bg-ai-primary rounded-full mb-8 shadow-lg shadow-ai-primary/20" />
              <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-lg">
                We're on a mission to redefine the technology landscape. 
                Whether you're a seasoned professional or an aspiring talent, 
                let's build the future together.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5 p-6 rounded-3xl glass hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-14 h-14 bg-ai-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <GraduationCap className="text-ai-primary w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Internship Programs</div>
                    <div className="text-sm text-white/50">Nurturing the next generation of tech leaders.</div>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-6 rounded-3xl glass hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-14 h-14 bg-ai-secondary/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <Briefcase className="text-ai-secondary w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Professional Careers</div>
                    <div className="text-sm text-white/50">Scale your impact with industry experts.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {
                  setSelectedJob(job);
                  setShowApplyModal(true);
                }}
                className="glass p-8 rounded-[2rem] flex items-center justify-between group hover:border-ai-primary/50 transition-all cursor-pointer border border-white/5 hover:shadow-2xl hover:shadow-ai-primary/10"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-ai-primary transition-all duration-500 shadow-xl">
                    <Briefcase className="text-white group-hover:scale-110 transition-transform w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-ai-primary transition-colors">{job.title}</h3>
                    <div className="flex gap-4 items-center">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                        <Clock className="w-3 h-3" /> {job.type}
                      </span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-ai-primary/20 transition-colors">
                  <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-ai-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </motion.div>
            ))}
            {jobs.length === 0 && (
              <div className="text-center py-20 glass rounded-[2rem] border border-dashed border-white/10 text-white/30">
                No active openings at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplyModal && selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050b1a]/90 backdrop-blur-xl"
              onClick={() => !isSubmitting && setShowApplyModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-[3rem] shadow-2xl p-8 lg:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar text-gray-900"
            >
              {showSuccess ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Send className="text-green-500 w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-display font-bold mb-4">Application Sent!</h2>
                  <p className="text-gray-600">Thank you for applying. We will review your profile and get back to you soon.</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Job Details Sidebar */}
                  <div className="space-y-8">
                    <div>
                      <span className="px-4 py-1 bg-ai-primary/20 text-ai-primary text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4 inline-block">
                        Hiring Now
                      </span>
                      <h2 className="text-3xl font-display font-bold mb-4">{selectedJob.title}</h2>
                      <div className="flex gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {selectedJob.type}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-ai-secondary">
                          <FileText className="w-5 h-5" /> Job Description
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                          {selectedJob.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-ai-primary">
                          <CheckCircle className="w-5 h-5" /> Key Responsibilities
                        </h4>
                        <ul className="space-y-3">
                          {selectedJob.responsibilities.split('\n').map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 group">
                              <div className="w-1.5 h-1.5 bg-ai-primary rounded-full mt-1.5 group-hover:scale-150 transition-transform" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Application Form */}
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                    <h3 className="text-2xl font-bold mb-8">Quick Application</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-ai-primary transition-colors text-sm text-gray-900"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                              required
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-ai-primary transition-colors text-sm text-gray-900"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-ai-primary transition-colors text-sm text-gray-900"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Total Experience</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <select 
                              required
                              value={formData.experience}
                              onChange={(e) => setFormData({...formData, experience: e.target.value})}
                              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-ai-primary transition-colors text-sm appearance-none text-gray-900"
                            >
                              <option value="" disabled className="bg-white">Years of Experience</option>
                              <option value="Fresher" className="bg-white">Fresher</option>
                              <option value="1-2 Years" className="bg-white">1-2 Years</option>
                              <option value="3-5 Years" className="bg-white">3-5 Years</option>
                              <option value="5+ Years" className="bg-white">5+ Years</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Resume Link (Google Drive/Dropbox)</label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          <input 
                            required
                            type="url"
                            value={formData.resumeUrl}
                            onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-ai-primary transition-colors text-sm text-gray-900"
                            placeholder="https://drive.google.com/..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Cover Letter / Message (Optional)</label>
                        <textarea 
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full bg-white border border-gray-200 rounded-2xl p-4 outline-none focus:border-ai-primary transition-colors text-sm text-gray-900"
                          placeholder="Tell us why you are a great fit..."
                        />
                      </div>

                      <button 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-ai-primary text-white font-bold rounded-2xl shadow-xl shadow-ai-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Submit Application <Send className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

