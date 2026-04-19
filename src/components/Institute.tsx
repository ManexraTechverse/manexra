import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Briefcase, CheckCircle2, Clock, Users, Award, GraduationCap, Code2, ArrowRight } from 'lucide-react';
import EnrollmentModal from './EnrollmentModal';

const courses = [
  {
    category: 'Development Course',
    icon: BookOpen,
    color: 'bg-blue-500',
    items: ['Frontend Development', 'iOS App Development', 'Advanced Frontend (React/Next.js)', 'Cross-Platform (Flutter/React Native)', 'Backend Development (Node.js/Python)', 'Progressive Web App (PWA)', 'Full Stack Development', 'Core Programming (C/C++)', 'MERN Stack Development', 'Java Development', 'Android App Development', 'Python Development (Advanced)'],
  },
  {
    category: 'Internship Programs',
    icon: Briefcase,
    color: 'bg-ai-primary',
    items: ['3 Months Internship', '6 Months Internship', '9 Months Internship', '12 Months Internship'],
  },
  {
    category: 'School Program',
    icon: GraduationCap,
    color: 'bg-ai-secondary',
    items: ['Foundation Level (8th Std+)', 'Skill Level (9th - 10th Std)', 'Career Level (11th - 12th Std)', 'Activity-Based Learning', 'Advanced MS Office', 'Basic Programming'],
  },
];

const features = [
  { icon: Award, text: 'Certificate' },
  { icon: CheckCircle2, text: 'Live Projects' },
  { icon: Users, text: 'Job Assistance' },
  { icon: Users, text: 'Experienced Trainers' },
  { icon: Clock, text: 'Flexible Timing' },
];

const languages = [
  'Java', 'Python', 'JavaScript', 'TypeScript', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'Kotlin', 'Swift', 'Dart', 'Spring', 'Node.js', 'Django', 'Flask', '.NET', 'Laravel', 'Ruby on Rails', 'Express.js', 'Angular', 'React.js', 'Vue.js', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'
];

export default function Institute() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <section id="institute" className="py-24 bg-gray-50">
      <EnrollmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseName={selectedCategory} 
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">S.J IT INSTITUTE</h2>
          <div className="w-20 h-1 bg-ai-primary mx-auto rounded-full" />
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-sm font-bold">
            Empowering Through Technology • Transforming Tech Futures
          </p>
        </div>

        <div className="mb-24">
          <h3 className="text-2xl font-bold mb-12 text-center text-gray-900">Programming Languages & Frameworks</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {languages.map((lang) => (
              <div key={lang} className="bg-white px-6 py-3 rounded-xl text-sm font-bold text-gray-600 border border-gray-100 shadow-sm hover:text-ai-primary hover:border-ai-primary/50 transition-all cursor-default">
                {lang}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {courses.map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] h-full flex flex-col shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center shadow-lg`}>
                  <cat.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{cat.category}</h3>
              </div>
              <ul className="space-y-4 flex-grow">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-ai-primary rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => {
                  setSelectedCategory(cat.category);
                  setIsModalOpen(true);
                }}
                className={`mt-8 w-full py-3 rounded-xl border border-gray-100 text-xs font-bold uppercase tracking-widest hover:text-white transition-all ${cat.category === 'Development Course' ? 'hover:bg-blue-500' : cat.category === 'Internship Programs' ? 'hover:bg-ai-primary' : 'hover:bg-ai-secondary'}`}
              >
                Enroll Now
              </button>
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-[3rem] text-center border border-gray-100 shadow-xl">
          <h3 className="text-2xl font-bold mb-12 text-gray-900">Course Features</h3>
          <div className="flex flex-wrap justify-center gap-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-ai-primary/10 flex items-center justify-center border border-ai-primary/20">
                  <feature.icon className="text-ai-primary w-8 h-8" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-600">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
