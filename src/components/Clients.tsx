import { motion } from 'motion/react';

const clients = [
  'Freedy Co', 'Square Yards', 'Tanishq', 'Gram Connect', 'Vigyan Ashram', 
  'Aanandyatri', 'Demand', 'Life Republic', 'Power Up', 'Pristine', 
  'The Radiant Institute', 'Square Innovation', 'Sadhguru Tiles', 'Organic Shivar', 
  'Sccan Elite', 'Viraj Enterprises', 'Muktee', 'Tatsam', 'Yuva Foundation', 
  'Yuva Guru', 'Bus', 'Aishwaryam', 'Gyansetu', 'Mananand'
];

export default function Clients() {
  return (
    <section id="portfolio" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4 text-gray-900">Our Trusted Clients</h2>
          <div className="w-20 h-1 bg-ai-primary mx-auto rounded-full" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            We are proud to have partnered with these amazing organizations to deliver impactful digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {clients.map((client, idx) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-center text-center shadow-sm hover:shadow-md hover:border-ai-primary/20 transition-all"
            >
              <span className="text-sm font-bold text-gray-400 hover:text-ai-secondary transition-colors uppercase tracking-tight">
                {client}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-400 italic text-sm">Instant access to all our client details.</p>
        </div>
      </div>
    </section>
  );
}
