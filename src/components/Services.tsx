import { motion } from 'motion/react';
import { BrainCircuit, Code, ShoppingCart, Settings, Share2, Target, Search, Palette, Globe, Megaphone, Linkedin, Youtube, Mail, Layout, FileText, Bot, Mic, Zap, BarChart3, Image, UserCheck, Cpu, Smartphone, PenTool, Shield, Cloud, BarChart, Database } from 'lucide-react';

const serviceCategories = [
  {
    title: 'Technology Services',
    icon: Globe,
    color: 'from-blue-500 to-cyan-400',
    items: [
      { name: 'Web Design Development', icon: Globe },
      { name: 'UI/UX Design', icon: Palette },
      { name: 'Android & iOS App Development', icon: Smartphone },
      { name: 'Custom Software Development', icon: Cpu },
      { name: 'Product Design & Development', icon: PenTool },
      { name: 'ReactJS Development', icon: Code },
      { name: 'React Native Development', icon: Smartphone },
      { name: 'Cloud Application Development', icon: Cloud },
      { name: 'E-commerce Development', icon: ShoppingCart },
      { name: 'Database Development', icon: Database },
      { name: 'Technical Consulting', icon: Shield },
      { name: 'Support & Management', icon: Settings },
    ],
  },
  {
    title: 'Digital Services',
    icon: BarChart,
    color: 'from-purple-500 to-pink-400',
    items: [
      { name: 'Social Media Marketing', icon: Share2 },
      { name: 'Lead Generation', icon: Target },
      { name: 'SEO Optimization', icon: Search },
      { name: 'Graphics Designing', icon: Palette },
      { name: 'Google Ads (PPC Ads)', icon: Megaphone },
      { name: 'Website Design & Development', icon: Globe },
      { name: 'Sponsors Ads', icon: BarChart },
      { name: 'LinkedIn Marketing', icon: Linkedin },
      { name: 'YouTube & Display Ads', icon: Youtube },
      { name: 'Email Marketing', icon: Mail },
      { name: 'ORM Management', icon: Layout },
      { name: 'Content Marketing', icon: FileText },
    ],
  },
  {
    title: 'AI Services',
    icon: Bot,
    color: 'from-ai-primary to-ai-secondary',
    items: [
      { name: 'AI Chatbot Development', icon: Bot },
      { name: 'AI Voice Assistants', icon: Mic },
      { name: 'AI Process Automation', icon: Zap },
      { name: 'AI Predictive Analytics', icon: BarChart3 },
      { name: 'AI Data Analytics & Insights', icon: BrainCircuit },
      { name: 'AI Image Recognition Solutions', icon: Image },
      { name: 'AI Recommendation Systems', icon: Search },
      { name: 'AI Personalization Engines', icon: UserCheck },
      { name: 'AI Document Processing', icon: FileText },
      { name: 'Custom AI Model Development', icon: Cpu },
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">Our Comprehensive Services</h2>
          <div className="w-20 h-1 bg-ai-primary mx-auto rounded-full" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of technology, digital, and AI services to help you build and scale your digital products.
          </p>
        </div>

        <div className="space-y-20">
          {serviceCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              id={cat.title.toLowerCase().replace(' ', '-')}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl border border-gray-100"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${cat.color} opacity-5 blur-3xl`} />
              
              <div className="flex items-center gap-4 mb-12 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                  <cat.icon className="text-white w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{cat.title}</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-ai-primary/30 hover:bg-white hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl bg-ai-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-ai-primary" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
