import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    image: 'https://picsum.photos/seed/shop/600/400',
    desc: 'A full-featured e-commerce solution with real-time inventory.',
  },
  {
    title: 'AI Health Assistant',
    category: 'AI Solutions',
    image: 'https://picsum.photos/seed/ai/600/400',
    desc: 'Machine learning model for early symptom detection.',
  },
  {
    title: 'School Management',
    category: 'Software',
    image: 'https://picsum.photos/seed/school/600/400',
    desc: 'Comprehensive ERP for educational institutions.',
  },
  {
    title: 'FinTech Mobile App',
    category: 'Mobile App',
    image: 'https://picsum.photos/seed/bank/600/400',
    desc: 'Secure digital banking and investment platform.',
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-display font-bold mb-4">Our Portfolio</h2>
            <div className="w-20 h-1 bg-ai-primary rounded-full" />
            <p className="mt-6 text-white/60 max-w-xl">
              Explore our latest projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
          <div className="flex gap-4">
            {['All', 'Web', 'Software', 'AI'].map((tab) => (
              <button key={tab} className="px-6 py-2 rounded-full border border-white/10 text-sm font-medium hover:bg-ai-primary hover:text-tech-bg transition-all">
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden border border-white/10"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tech-bg via-tech-bg/40 to-transparent opacity-90" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-xs font-bold text-ai-primary uppercase tracking-widest mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-white/60 mb-6 line-clamp-2">
                  {project.desc}
                </p>
                <div className="flex gap-4">
                  <button className="p-3 rounded-xl bg-white/10 hover:bg-ai-primary hover:text-tech-bg transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-xl bg-white/10 hover:bg-ai-primary hover:text-tech-bg transition-colors">
                    <Github className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
