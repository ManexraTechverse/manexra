import { motion } from 'motion/react';
import { Target, Eye, Award, Users, Briefcase, Zap, Lightbulb } from 'lucide-react';

const stats = [
  { label: 'Key Service Areas', value: '3', icon: Briefcase },
  { label: 'Years of Shared Knowledge', value: '20+', icon: Award },
  { label: 'Clients Guided', value: '500+', icon: Users },
];

const features = [
  { title: 'Highly Skilled Tech Team', icon: Users },
  { title: 'Smart Solution Experts', icon: Zap },
  { title: 'Smart Thinking Method', icon: Lightbulb },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">About Manexra</h2>
          <div className="w-20 h-1 bg-ai-primary mx-auto rounded-full" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Manexra is a company that uses technology to turn complex business needs into clear, delightful solutions for customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center group hover:border-ai-primary transition-colors"
            >
              <div className="w-16 h-16 bg-ai-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-ai-primary transition-colors">
                <stat.icon className="text-ai-primary group-hover:text-white w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 flex items-center justify-center">
              <img 
                src="/clogo.png" 
                alt="Manexra Techverse" 
                className="w-full max-w-[400px] h-auto object-contain"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl max-w-[280px] shadow-xl border border-ai-primary/20">
              <p className="text-gray-700 italic font-medium leading-relaxed">
                "Great BUSINESS is not built by technology alone... It's powered by PEOPLE and perfected by TECHNOLOGY."
              </p>
              <div className="mt-4 font-bold text-ai-primary text-xs uppercase tracking-widest">
                Manexra Philosophy
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold mb-6 text-gray-900">Our Story</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Manexra Techverse Private Limited was established with a vision to deliver innovative and scalable digital solutions to modern businesses. We specialize in bridging the gap between technology and real-world business challenges by providing smart, efficient, and result-driven IT services.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              From startups to growing enterprises, we empower organizations with cutting-edge solutions in web development, software engineering, and AI integration. Our approach focuses on understanding client needs, delivering customized solutions, and ensuring long-term value. At Manexra Techverse, we don't just build projects — we build digital success stories.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.title} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-3">
                  <f.icon className="w-6 h-6 text-ai-secondary" />
                  <span className="text-xs font-bold text-gray-700">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <div className="w-14 h-14 bg-ai-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Target className="text-ai-primary w-7 h-7" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h4>
            <p className="text-gray-600 leading-relaxed">
              To deliver innovative, reliable, and scalable technology solutions that help businesses grow and succeed in the digital era.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <div className="w-14 h-14 bg-ai-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="text-ai-secondary w-7 h-7" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h4>
            <p className="text-gray-600 leading-relaxed">
              To become a leading technology company recognized for innovation, quality, and impactful digital transformation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
