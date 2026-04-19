import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, Clock, ArrowRight, ClipboardList, Send, ChevronLeft } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp, orderBy } from 'firebase/firestore';

export default function TestSystem() {
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const path = 'tests';
    const q = query(collection(db, path), where('isActive', '==', true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAvailableTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, path));

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedTest || !isStarted) return;

    const path = `tests/${selectedTest.id}/questions`;
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, path));

    return () => unsubscribe();
  }, [selectedTest, isStarted]);

  const handleStartRequest = (test: any) => {
    setSelectedTest(test);
    setShowRegistration(true);
  };

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegistration(false);
    setIsStarted(true);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const path = 'submissions';
    try {
      // Calculate score if possible (for MCQs)
      let score = 'Pending Review';
      if (questions.length > 0 && questions.every(q => q.type === 'mcq' || q.type === 'tf')) {
        let correct = 0;
        questions.forEach(q => {
          if (answers[q.id] === q.correctAnswer) correct++;
        });
        score = `${correct}/${questions.length}`;
      }

      await addDoc(collection(db, path), {
        studentName: formData.name,
        email: formData.email,
        phone: formData.phone,
        testId: selectedTest.id,
        testName: selectedTest.name,
        score,
        answers,
        submittedAt: serverTimestamp()
      });
      
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading tests...</div>;

  if (isSubmitted) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Test Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Thank you, <span className="font-bold text-gray-900">{formData.name}</span>. Your responses have been recorded. Our team will review your test and get back to you soon.
          </p>
          <button 
            onClick={() => window.location.hash = ''}
            className="w-full py-4 bg-ai-secondary text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
          >
            Back to Home
          </button>
        </motion.div>
      </section>
    );
  }

  if (showRegistration) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
        >
          <button onClick={() => setShowRegistration(false)} className="text-ai-secondary font-bold mb-6 flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" /> Back to List
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register for {selectedTest.name}</h2>
          <p className="text-gray-500 mb-8">Please provide your details to begin the assessment.</p>
          
          <form onSubmit={handleStartTest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" placeholder="Enter your name" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" placeholder="Phone number" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-ai-primary text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
              Start Test Now
            </button>
          </form>
        </motion.div>
      </section>
    );
  }

  if (isStarted && questions.length > 0) {
    const currentQ = questions[currentQuestionIdx];
    return (
      <section className="min-h-screen bg-gray-50 p-6 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-ai-secondary p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedTest.name}</h2>
                <p className="text-white/70 text-sm">Question {currentQuestionIdx + 1} of {questions.length}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{selectedTest.duration}</span>
              </div>
            </div>

            <div className="p-10">
              <div className="mb-8">
                <span className="px-3 py-1 bg-ai-primary/10 text-ai-primary text-xs font-bold uppercase rounded-full mb-4 inline-block">
                  {currentQ.type}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{currentQ.text}</h3>
              </div>

              <div className="space-y-4 mb-10">
                {currentQ.type === 'mcq' && currentQ.options.map((opt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentQ.id, opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${
                      answers[currentQ.id] === opt 
                        ? 'border-ai-primary bg-ai-primary/5 text-ai-primary shadow-md' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        answers[currentQ.id] === opt ? 'bg-ai-primary text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </div>
                  </button>
                ))}
                {(currentQ.type === 'short' || currentQ.type === 'programming') && (
                  <textarea
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary min-h-[150px]"
                    placeholder="Type your answer here..."
                  />
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                
                {currentQuestionIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="flex items-center gap-2 bg-ai-secondary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                  >
                    Next Question <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Test'} <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="test-system" className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">Available Tests</h2>
          <div className="w-20 h-1 bg-ai-primary mx-auto rounded-full" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Select a test to begin your assessment. Your results will be used for enrollment and placement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-ai-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-ai-primary/10 rounded-xl flex items-center justify-center group-hover:bg-ai-primary transition-colors">
                  <BookOpen className="text-ai-primary group-hover:text-white w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {test.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-ai-secondary transition-colors">
                {test.name}
              </h3>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {test.duration}
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  {test.questionsCount || 0} Qs
                </div>
              </div>

              <button 
                onClick={() => handleStartRequest(test)}
                className="w-full py-3 rounded-xl border border-ai-secondary text-ai-secondary font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-ai-secondary group-hover:text-white transition-all"
              >
                Start Test <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          {availableTests.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 italic">
              No active tests available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
