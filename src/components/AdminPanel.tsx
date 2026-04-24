import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ClipboardList, Users, Activity, Plus, LogOut, Search, Filter, Download, Edit, Trash2, ChevronRight, CheckCircle, XCircle, Clock, BookOpen, Save, X, MessageSquare, UserPlus, Briefcase, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeJobTab, setActiveJobTab] = useState<'openings' | 'applications'>('openings');
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'test' | 'question' | 'submission' | 'enrollment' | 'message' | 'job' | 'job_application' | 'product', title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States
  const [testForm, setTestForm] = useState({
    name: '',
    type: 'Internship',
    totalMarks: 50,
    passingMarks: 20,
    duration: '30 mins',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 5
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    responsibilities: '',
    type: 'Full Time',
    location: 'Remote / Office',
    isActive: true
  });

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    iconName: 'Layout',
    price: 'Custom',
    features: '',
    isActive: true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const adminEmails = [
        'manexratechverse@gmail.com', 
        'manexratechverse@gmal.com', 
        'management.manexratechverse@gmail.com'
      ];
      if (user && user.email && adminEmails.includes(user.email.toLowerCase())) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Submissions Listener
    const subPath = 'submissions';
    const subQ = query(collection(db, subPath), orderBy('submittedAt', 'desc'), limit(50));
    const unsubSubs = onSnapshot(subQ, (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, subPath));

    // Tests Listener
    const testPath = 'tests';
    const testQ = query(collection(db, testPath), orderBy('name', 'asc'));
    const unsubTests = onSnapshot(testQ, (snapshot) => {
      setTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, testPath));

    // Messages Listener
    const msgPath = 'contact_messages';
    const msgQ = query(collection(db, msgPath), orderBy('submittedAt', 'desc'));
    const unsubMsgs = onSnapshot(msgQ, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, msgPath));

    // Enrollments Listener
    const enrollPath = 'enrollments';
    const enrollQ = query(collection(db, enrollPath), orderBy('submittedAt', 'desc'));
    const unsubEnrolls = onSnapshot(enrollQ, (snapshot) => {
      setEnrollments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, enrollPath));

    // Jobs Listener
    const jobPath = 'jobs';
    const jobQ = query(collection(db, jobPath), orderBy('createdAt', 'desc'));
    const unsubJobs = onSnapshot(jobQ, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, jobPath));

    // Job Applications Listener
    const jobAppPath = 'job_applications';
    const jobAppQ = query(collection(db, jobAppPath), orderBy('submittedAt', 'desc'));
    const unsubJobApps = onSnapshot(jobAppQ, (snapshot) => {
      setJobApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, jobAppPath));

    // Products Listener
    const productPath = 'products';
    const productQ = query(collection(db, productPath), orderBy('createdAt', 'desc'));
    const unsubProducts = onSnapshot(productQ, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, productPath));

    return () => {
      unsubSubs();
      unsubTests();
      unsubMsgs();
      unsubEnrolls();
      unsubJobs();
      unsubJobApps();
      unsubProducts();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!selectedTestForQuestions) return;

    const path = `tests/${selectedTestForQuestions.id}/questions`;
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, path));

    return () => unsub();
  }, [selectedTestForQuestions]);

  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    // Normalize emails for comparison
    const normalizedEmail = email.toLowerCase().trim();
    const adminEmails = [
      'manexratechverse@gmail.com', 
      'manexratechverse@gmal.com', 
      'management.manexratechverse@gmail.com'
    ];
    
    if (!adminEmails.includes(normalizedEmail)) {
      setError(`Access denied. Please use an authorized admin email.`);
      setIsLoggingIn(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (err: any) {
      console.error('Initial login attempt failed:', err.code, err.message);
      
      // Modern Firebase uses auth/invalid-credential for generic failures
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          // If creation succeeds, the user is automatically signed in
          setError('');
        } catch (createErr: any) {
          console.error('Bootstrap attempt failed:', createErr.code);
          if (createErr.code === 'auth/email-already-in-use') {
            setError('Incorrect password. Please use Google Login or the Forgot Password link.');
          } else if (createErr.code === 'auth/weak-password') {
            setError('The password must be at least 6 characters.');
          } else {
            setError(`Authentication error: ${createErr.message}`);
          }
        }
      } else {
        setError(`Login failed: ${err.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      setError(`Failed to send reset email: ${err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const adminEmails = ['manexratechverse@gmail.com', 'manexratechverse@gmal.com', 'management.manexratechverse@gmail.com'];
      
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        setIsLoggedIn(true);
      } else {
        await signOut(auth);
        setError('Access denied. This Google account is not an authorized administrator.');
      }
    } catch (err: any) {
      setError(`Google login failed: ${err.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
  };

  const saveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'tests';
    try {
      if (editingTest) {
        await updateDoc(doc(db, path, editingTest.id), testForm);
      } else {
        await addDoc(collection(db, path), { 
          ...testForm, 
          questionsCount: 0,
          createdAt: serverTimestamp() 
        });
      }
      setShowTestModal(false);
      setEditingTest(null);
      setTestForm({ name: '', type: 'Internship', totalMarks: 50, passingMarks: 20, duration: '30 mins', startDate: '', endDate: '', isActive: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteTest = async (id: string) => {
    const path = 'tests';
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const saveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestForQuestions) return;
    const path = `tests/${selectedTestForQuestions.id}/questions`;
    try {
      if (editingQuestion) {
        await updateDoc(doc(db, path, editingQuestion.id), questionForm);
      } else {
        await addDoc(collection(db, path), {
          ...questionForm,
          createdAt: serverTimestamp()
        });
        // Update questions count in test doc
        await updateDoc(doc(db, 'tests', selectedTestForQuestions.id), {
          questionsCount: (selectedTestForQuestions.questionsCount || 0) + 1
        });
        // Update local state to reflect count change immediately
        setSelectedTestForQuestions({
          ...selectedTestForQuestions,
          questionsCount: (selectedTestForQuestions.questionsCount || 0) + 1
        });
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      setQuestionForm({ text: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 5 });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteQuestion = async (id: string) => {
    const path = `tests/${selectedTestForQuestions.id}/questions`;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      await updateDoc(doc(db, 'tests', selectedTestForQuestions.id), {
        questionsCount: Math.max(0, (selectedTestForQuestions.questionsCount || 0) - 1)
      });
      // Update local state
      setSelectedTestForQuestions({
        ...selectedTestForQuestions,
        questionsCount: Math.max(0, (selectedTestForQuestions.questionsCount || 0) - 1)
      });
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    const path = 'submissions';
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteEnrollment = async (id: string) => {
    const path = 'enrollments';
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteMessage = async (id: string) => {
    const path = 'contact_messages';
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const saveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'jobs';
    try {
      if (editingJob) {
        await updateDoc(doc(db, path, editingJob.id), jobForm);
      } else {
        await addDoc(collection(db, path), {
          ...jobForm,
          createdAt: serverTimestamp()
        });
      }
      setShowJobModal(false);
      setEditingJob(null);
      setJobForm({ title: '', description: '', responsibilities: '', type: 'Full Time', location: 'Remote / Office', isActive: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteJob = async (id: string) => {
    const path = 'jobs';
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteJobApplication = async (id: string) => {
    const path = 'job_applications';
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateJobApplicationStatus = async (id: string, status: 'accepted' | 'rejected' | 'pending') => {
    const path = 'job_applications';
    try {
      await updateDoc(doc(db, path, id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'products';
    try {
      if (editingProduct) {
        await updateDoc(doc(db, path, editingProduct.id), productForm);
      } else {
        await addDoc(collection(db, path), {
          ...productForm,
          createdAt: serverTimestamp()
        });
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ title: '', description: '', iconName: 'Layout', price: 'Custom', features: '', isActive: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteProduct = async (id: string) => {
    const path = 'products';
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, path, id));
      setConfirmDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsDeleting(false);
    }
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    switch (confirmDelete.type) {
      case 'test': deleteTest(confirmDelete.id); break;
      case 'question': deleteQuestion(confirmDelete.id); break;
      case 'submission': deleteSubmission(confirmDelete.id); break;
      case 'enrollment': deleteEnrollment(confirmDelete.id); break;
      case 'message': deleteMessage(confirmDelete.id); break;
      case 'job': deleteJob(confirmDelete.id); break;
      case 'job_application': deleteJobApplication(confirmDelete.id); break;
      case 'product': deleteProduct(confirmDelete.id); break;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isLoggedIn) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative">
        <a 
          href="#home" 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 font-bold hover:text-ai-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Home
        </a>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
        >
          <div className="text-center mb-10">
            <img 
              src="/clogo.png" 
              alt="Logo" 
              className="w-full max-w-[280px] mx-auto mb-6" 
            />
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access the panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-ai-primary outline-none transition-colors" 
                placeholder="Enter your email" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold uppercase tracking-widest text-ai-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-ai-primary outline-none transition-colors" 
                placeholder="••••••••" 
              />
            </div>
            {resetSent && <p className="text-green-500 text-xs font-bold">Password reset email sent! Check your inbox.</p>}
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl bg-ai-secondary text-white font-bold hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Authenticating...' : 'Login with Password'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </form>
        </motion.div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col">
        <div className="flex flex-col items-center gap-3 mb-12 text-center">
          <img 
            src="/clogo.png" 
            alt="Logo" 
            className="w-full px-2 mb-2" 
          />
          <span className="font-bold text-ai-secondary text-[10px] tracking-widest">ADMIN DASHBOARD</span>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'tests', name: 'Test Management', icon: ClipboardList },
            { id: 'submissions', name: 'Test Responses', icon: Users },
            { id: 'enrollments', name: 'Course Enrollments', icon: UserPlus },
            { id: 'products', name: 'Products', icon: ShoppingBag },
            { id: 'careers', name: 'Careers', icon: Briefcase },
            { id: 'messages', name: 'Contact Messages', icon: MessageSquare },
            { id: 'activity', name: 'Recent Activity', icon: Activity },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedTestForQuestions(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-ai-primary/10 text-ai-primary shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {selectedTestForQuestions ? `Questions: ${selectedTestForQuestions.name}` : activeTab}
            </h1>
            <p className="text-gray-500">Welcome back, Manexra Admin</p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'products' && (
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ title: '', description: '', iconName: 'Layout', price: 'Custom', features: '', isActive: true });
                  setShowProductModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-ai-primary text-white rounded-lg text-sm font-bold hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
            {activeTab === 'careers' && (
              <button 
                onClick={() => {
                  setEditingJob(null);
                  setJobForm({ title: '', description: '', responsibilities: '', type: 'Full Time', location: 'Remote / Office', isActive: true });
                  setShowJobModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-ai-primary text-white rounded-lg text-sm font-bold hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Add Job Opening
              </button>
            )}
            {activeTab === 'submissions' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" /> Export to Excel
              </button>
            )}
            {activeTab === 'tests' && !selectedTestForQuestions && (
              <button 
                onClick={() => {
                  setEditingTest(null);
                  setTestForm({ name: '', type: 'Internship', totalMarks: 50, passingMarks: 20, duration: '30 mins', startDate: '', endDate: '', isActive: true });
                  setShowTestModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-ai-primary text-white rounded-lg text-sm font-bold hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Create New Test
              </button>
            )}
            {selectedTestForQuestions && (
              <button 
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionForm({ text: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 5 });
                  setShowQuestionModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-ai-secondary text-white rounded-lg text-sm font-bold hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Students', value: submissions.length.toString(), icon: Users, color: 'bg-blue-500' },
                { label: 'Total Tests', value: tests.length.toString(), icon: ClipboardList, color: 'bg-orange-500' },
                { label: 'Total Submissions', value: submissions.length.toString(), icon: Activity, color: 'bg-green-500' },
                { label: 'Active Sessions', value: tests.filter(t => t.isActive).length.toString(), icon: Activity, color: 'bg-purple-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="text-white w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Submissions</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Test Name</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{row.studentName}</td>
                      <td className="px-6 py-4 text-gray-600">{row.testName}</td>
                      <td className="px-6 py-4 font-mono text-ai-secondary font-bold">{row.score}</td>
                      <td className="px-6 py-4 text-gray-500">{row.submittedAt?.seconds ? new Date(row.submittedAt.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          row.score !== 'Pending Review' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {row.score !== 'Pending Review' ? 'Graded' : 'Reviewing'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setConfirmDelete({ id: row.id, type: 'submission', title: `Submission from ${row.studentName}` })}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tests' && !selectedTestForQuestions && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-ai-primary/10 rounded-2xl flex items-center justify-center">
                    <BookOpen className="text-ai-primary w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingTest(test);
                        setTestForm({ ...test });
                        setShowTestModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-ai-secondary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setConfirmDelete({ id: test.id, type: 'test', title: test.name })}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{test.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.duration}</span>
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {test.totalMarks} Marks</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    test.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {test.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button 
                    onClick={() => setSelectedTestForQuestions(test)}
                    className="text-ai-secondary text-sm font-bold flex items-center gap-1 hover:translate-x-1 transition-transform"
                  >
                    Manage Questions <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTestForQuestions && (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedTestForQuestions(null)}
              className="text-ai-secondary font-bold flex items-center gap-2 mb-4 hover:-translate-x-1 transition-transform"
            >
              ← Back to Tests
            </button>
            <div className="grid gap-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {idx + 1}
                      </span>
                      <span className="px-2 py-0.5 bg-ai-primary/10 text-ai-primary text-[10px] font-bold uppercase rounded">
                        {q.type}
                      </span>
                      <span className="text-xs text-gray-400">{q.marks} Marks</span>
                    </div>
                    <p className="text-gray-900 font-medium">{q.text}</p>
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {q.options.map((opt: string, i: number) => (
                          <div key={i} className={`text-sm p-2 rounded-lg border ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingQuestion(q);
                        setQuestionForm({ ...q });
                        setShowQuestionModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-ai-secondary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setConfirmDelete({ id: q.id, type: 'question', title: q.text })}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                  No questions added yet. Click "Add Question" to start.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Test</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{row.studentName}</div>
                      <div className="text-xs text-gray-400">{row.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{row.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{row.testName}</td>
                    <td className="px-6 py-4 font-mono text-ai-secondary font-bold">{row.score}</td>
                    <td className="px-6 py-4 text-gray-500">{row.submittedAt?.seconds ? new Date(row.submittedAt.seconds * 1000).toLocaleString() : 'Just now'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setConfirmDelete({ id: row.id, type: 'submission', title: `Submission from ${row.studentName}` })}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrollments.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{row.name}</div>
                      <div className="text-xs text-gray-400">{row.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{row.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-ai-primary/10 text-ai-primary text-[10px] font-bold uppercase rounded-full">
                        {row.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{row.address}</td>
                    <td className="px-6 py-4 text-gray-500">{row.submittedAt?.seconds ? new Date(row.submittedAt.seconds * 1000).toLocaleString() : 'Just now'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setConfirmDelete({ id: row.id, type: 'enrollment', title: `Enrollment for ${row.name}` })}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="space-y-8">
            <div className="flex gap-4 border-b border-gray-100">
              {['openings', 'applications'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveJobTab(t as any)}
                  className={`pb-4 px-2 text-sm font-bold capitalize transition-all relative ${
                    activeJobTab === t ? 'text-ai-primary' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t}
                  {activeJobTab === t && (
                    <motion.div layoutId="jobTab" className="absolute bottom-0 left-0 right-0 h-1 bg-ai-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {activeJobTab === 'openings' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <Briefcase className="text-ai-primary w-6 h-6" />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingJob(job);
                            setJobForm({ ...job });
                            setShowJobModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-ai-secondary transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setConfirmDelete({ id: job.id, type: 'job', title: job.title })}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
                    <div className="flex gap-2 mb-4">
                      <span className="text-[10px] uppercase font-bold text-gray-400">{job.type}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">•</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">{job.location}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">{job.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                    No job openings posted yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {jobApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{app.name}</div>
                            <div className="text-xs text-gray-400">{app.email}</div>
                            <div className="text-xs text-gray-400">{app.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-medium">{app.jobTitle}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            <div>Exp: {app.experience}</div>
                            <a 
                              href={app.resumeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-ai-primary flex items-center gap-1 hover:underline text-xs font-bold mt-1"
                            >
                              Resume <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              app.status === 'accepted' ? 'bg-green-100 text-green-600' : 
                              app.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {app.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {(!app.status || app.status === 'pending') && (
                                <>
                                  <button 
                                    onClick={() => updateJobApplicationStatus(app.id, 'accepted')}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Accept Application"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => updateJobApplicationStatus(app.id, 'rejected')}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Reject Application"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {app.status && app.status !== 'pending' && (
                                <button 
                                  onClick={() => updateJobApplicationStatus(app.id, 'pending')}
                                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Reset to Pending"
                                >
                                  <Clock className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setConfirmDelete({ id: app.id, type: 'job_application', title: `Application from ${app.name}` })}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {jobApplications.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                          No job applications received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="text-ai-primary w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm({ ...product });
                        setShowProductModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-ai-secondary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setConfirmDelete({ id: product.id, type: 'product', title: product.title })}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{product.title}</h3>
                <div className="text-xs text-ai-primary font-bold uppercase tracking-wider mb-4">{product.price}</div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${product.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                No products added yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid gap-6">
            {messages.map((msg, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="text-gray-400 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{msg.name}</h4>
                      <p className="text-xs text-gray-400">{msg.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setConfirmDelete({ id: msg.id, type: 'message', title: `Message from ${msg.name}` })}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 bg-ai-secondary/10 text-ai-secondary text-[10px] font-bold uppercase rounded-full h-fit">
                        {msg.subject}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {msg.submittedAt?.seconds ? new Date(msg.submittedAt.seconds * 1000).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl text-gray-600 text-sm leading-relaxed">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setShowJobModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{editingJob ? 'Edit Job Opening' : 'Post New Job Opening'}</h2>
                <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={saveJob} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Job Title</label>
                    <input 
                      required
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g. Senior Backend Developer"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Job Type</label>
                    <select 
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Location</label>
                    <input 
                      required
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="e.g. Remote / Office"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input 
                      type="checkbox"
                      checked={jobForm.isActive}
                      onChange={(e) => setJobForm({ ...jobForm, isActive: e.target.checked })}
                      className="w-5 h-5 rounded accent-ai-primary"
                    />
                    <label className="text-sm font-bold text-gray-700">Set as Active</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Key Responsibilities (One per line)</label>
                  <textarea 
                    required
                    rows={6}
                    value={jobForm.responsibilities}
                    onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                    placeholder="Build scalable APIs&#10;Optimize database queries&#10;Collaborate with front-end team"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-ai-primary text-white font-bold rounded-xl shadow-lg shadow-ai-primary/20 hover:scale-[1.02] transition-transform"
                >
                  {editingJob ? 'Save Changes' : 'Post Job Opening'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setShowProductModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add Ready Product'}</h2>
                <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={saveProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Title</label>
                    <input 
                      required
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      placeholder="e.g. School ERP"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Icon Type</label>
                    <select 
                      value={productForm.iconName}
                      onChange={(e) => setProductForm({ ...productForm, iconName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                    >
                      <option value="Layout">Dashboard/Layout</option>
                      <option value="Settings">Settings/Tools</option>
                      <option value="ShoppingCart">E-commerce</option>
                      <option value="Bot">AI/Bot</option>
                      <option value="Smartphone">Mobile/App</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Price Label</label>
                    <input 
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. Custom or $99"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input 
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="w-5 h-5 rounded accent-ai-primary"
                    />
                    <label className="text-sm font-bold text-gray-700">Set as Active</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Short Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Key Features (One per line)</label>
                  <textarea 
                    rows={4}
                    value={productForm.features}
                    onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                    placeholder="Real-time tracking&#10;Cloud backup&#10;Multi-user support"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-ai-primary"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-ai-primary text-white font-bold rounded-xl shadow-lg shadow-ai-primary/20 hover:scale-[1.02] transition-transform"
                >
                  {editingProduct ? 'Save Product' : 'Add Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Test Modal */}
      <AnimatePresence>
        {showTestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setShowTestModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{editingTest ? 'Edit Test' : 'Create New Test'}</h2>
                <button onClick={() => setShowTestModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={saveTest} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Test Name</label>
                  <input required type="text" value={testForm.name} onChange={e => setTestForm({...testForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" placeholder="e.g. Pre-Internship Assessment" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Test Type</label>
                  <select value={testForm.type} onChange={e => setTestForm({...testForm, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary">
                    <option>Internship</option><option>School</option><option>Programming</option><option>Skill</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Duration</label>
                  <input required type="text" value={testForm.duration} onChange={e => setTestForm({...testForm, duration: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" placeholder="e.g. 30 mins" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Marks</label>
                  <input required type="number" value={testForm.totalMarks} onChange={e => setTestForm({...testForm, totalMarks: parseInt(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Passing Marks</label>
                  <input required type="number" value={testForm.passingMarks} onChange={e => setTestForm({...testForm, passingMarks: parseInt(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Start Date</label>
                  <input type="date" value={testForm.startDate} onChange={e => setTestForm({...testForm, startDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">End Date</label>
                  <input type="date" value={testForm.endDate} onChange={e => setTestForm({...testForm, endDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" />
                </div>
                <div className="col-span-2 flex items-center gap-3 py-4">
                  <input type="checkbox" checked={testForm.isActive} onChange={e => setTestForm({...testForm, isActive: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-ai-primary focus:ring-ai-primary" />
                  <label className="font-bold text-gray-700">Active / Launch Test</label>
                </div>
                <button type="submit" className="col-span-2 py-4 bg-ai-primary text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> {editingTest ? 'Update Test' : 'Create Test'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Question Modal */}
      <AnimatePresence>
        {showQuestionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setShowQuestionModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{editingQuestion ? 'Edit Question' : 'Add Question'}</h2>
                <button onClick={() => setShowQuestionModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={saveQuestion} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Question Text</label>
                  <textarea required value={questionForm.text} onChange={e => setQuestionForm({...questionForm, text: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary min-h-[100px]" placeholder="Enter question here..." />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Type</label>
                    <select value={questionForm.type} onChange={e => setQuestionForm({...questionForm, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary">
                      <option value="mcq">MCQ</option><option value="tf">True/False</option><option value="short">Short Answer</option><option value="programming">Programming</option><option value="file">File Upload</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Marks</label>
                    <input required type="number" value={questionForm.marks} onChange={e => setQuestionForm({...questionForm, marks: parseInt(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" />
                  </div>
                </div>
                {questionForm.type === 'mcq' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Options</label>
                    <div className="grid grid-cols-2 gap-4">
                      {questionForm.options.map((opt, i) => (
                        <input key={i} required type="text" value={opt} onChange={e => {
                          const newOpts = [...questionForm.options];
                          newOpts[i] = e.target.value;
                          setQuestionForm({...questionForm, options: newOpts});
                        }} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-ai-primary" placeholder={`Option ${i+1}`} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Correct Answer</label>
                  <input required type="text" value={questionForm.correctAnswer} onChange={e => setQuestionForm({...questionForm, correctAnswer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-ai-primary" placeholder="Enter correct answer" />
                </div>
                <button type="submit" className="w-full py-4 bg-ai-secondary text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => !isDeleting && setConfirmDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-500 mb-8">
                Are you sure you want to delete <span className="font-bold text-gray-900">"{confirmDelete.title}"</span>? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  disabled={isDeleting}
                  onClick={() => setConfirmDelete(null)}
                  className="py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={executeDelete}
                  className="py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
