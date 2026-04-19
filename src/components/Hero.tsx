import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Code, BrainCircuit } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-ai -z-10 opacity-30" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ai-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-ai-secondary/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-ai-primary text-xs font-bold mb-6 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Innovative & Scalable Digital Solutions
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 text-gray-900">
            Transforming <span className="text-gradient">Business Needs</span> into Digital Success
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
            Manexra Techverse Private Limited specializes in bridging the gap between technology and real-world business challenges with smart, efficient, and result-driven IT services.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-ai-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-ai-primary/20">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#services" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
              Explore Services
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-ai-secondary">500+</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Clients Guided</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-ai-secondary">20+</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Years Knowledge</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-ai-secondary">100%</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Result Driven</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl bg-white p-12 flex items-center justify-center">
            <img 
              src="/clogo.png" 
              alt="Manexra Techverse Logo" 
              className="w-full max-w-[500px] h-auto object-contain transform hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Floating Cards */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-20 shadow-xl border border-gray-100"
          >
            <div className="w-10 h-10 bg-ai-secondary rounded-lg flex items-center justify-center">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800">AI Solutions</div>
              <div className="text-[10px] text-ai-primary font-bold">Smart Tech</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-20 shadow-xl border border-gray-100"
          >
            <div className="w-10 h-10 bg-ai-primary rounded-lg flex items-center justify-center">
              <Code className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800">Digital Services</div>
              <div className="text-[10px] text-ai-secondary font-bold">Growth First</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
