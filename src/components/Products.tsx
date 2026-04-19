import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Layout, Smartphone, Bot, Settings, ShoppingBag } from 'lucide-react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';

const iconMap: { [key: string]: any } = {
  ShoppingCart,
  Layout,
  Smartphone,
  Bot,
  Settings,
  ShoppingBag
};

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((p: any) => p.isActive !== false);
      setProducts(productList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section id="products" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Our Ready Products</h2>
          <div className="w-20 h-1 bg-ai-primary mx-auto rounded-full" />
          <p className="mt-6 text-white/60 max-w-2xl mx-auto">
            Ready-to-use software solutions designed to streamline your business operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            const Icon = iconMap[product.iconName] || ShoppingBag;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 bg-ai-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="text-ai-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{product.title}</h3>
                <div className="text-xs text-ai-primary font-bold uppercase tracking-wider mb-4">{product.price}</div>
                <p className="text-sm text-white/50 mb-8 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-auto w-full">
                  <a 
                    href="#contact"
                    className="block w-full py-3 rounded-xl bg-ai-primary text-tech-bg font-bold text-sm text-center"
                  >
                    Request Demo
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
