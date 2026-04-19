import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Code, Rocket, GraduationCap, CheckCircle2, Award } from 'lucide-react';
import EnrollmentModal from './EnrollmentModal';

const programs = [
  {
    level: 'Foundation Level',
    target: '8th Std onwards',
    price: '₹199',
    icon: BookOpen,
    color: 'bg-blue-500',
    features: [
      'Activity-Based Learning',
      'Games, Drawing, fun tasks',
      'Interesting Quizzes',
      'Advanced MS Office',
      'Basic Programming',
      'Internet lab practice'
    ]
  },
  {
    level: 'Skill Level',
    target: '9th - 10th Std',
    price: '₹299',
    icon: Code,
    color: 'bg-ai-primary',
    features: [
      'Advanced MS Office',
      'Basic Programming',
      'C-Language (Intro)',
      'Practical Mini Projects',
      'Prompt Engineering',
      'Resume Basics',
      'Board Coverage (SSC/CBSE)',
      'HTML / CSS'
    ]
  },
  {
    level: 'Career Level',
    target: '11th - 12th Std',
    price: '₹499',
    icon: Rocket,
    color: 'bg-ai-secondary',
    features: [
      'HTML / CSS',
      'Intermediate C',
      'Career Guidance',
      'Advanced Excel & AI',
      'Programming Languages',
      'MS Programming',
      'Scholarship Preparation',
      'MCQ Practice & AI Quiz'
    ]
  }
];

export default function SchoolProgram() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');

  return (
    <section id="school-program" className="py-24 bg-white">
      <EnrollmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseName={selectedProgram} 
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 bg-ai-primary/10 text-ai-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4 inline-block">
            Hybrid Smart Learning
          </span>
          <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">School Program</h2>
          <div className="w-20 h-1 bg-ai-primary mx-auto rounded-full" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Empowering school students with modern tech skills through our specialized hybrid learning modules.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <motion.div
              key={prog.level}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 flex flex-col hover:shadow-2xl transition-all hover:-translate-y-2 group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 ${prog.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <prog.icon className="text-white w-7 h-7" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{prog.price}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Per Month</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{prog.level}</h3>
              <p className="text-ai-primary font-bold text-sm mb-8">{prog.target}</p>

              <div className="space-y-4 mb-10 flex-grow">
                {prog.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setSelectedProgram(prog.level);
                  setIsModalOpen(true);
                }}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] ${prog.color}`}
              >
                Enroll Now
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Live Projects', icon: Rocket },
            { label: 'Internships', icon: Briefcase },
            { label: 'Certificate', icon: Award },
            { label: 'Placement Support', icon: GraduationCap },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                {/* @ts-ignore */}
                <item.icon className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Briefcase = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
