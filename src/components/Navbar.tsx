import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, MoreHorizontal, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { 
    name: 'Our Services', 
    href: '#services',
    dropdown: [
      { name: 'Technical Services', href: '#services' },
      { name: 'Digital Services', href: '#digital-services' },
      { name: 'AI Services', href: '#ai-services' },
    ]
  },
  { name: 'Portfolio', href: '#portfolio' },
  { 
    name: 'Our Products', 
    href: '#products',
    dropdown: [
      { name: 'School Management', href: '#products' },
      { name: 'Billing Software', href: '#products' },
      { name: 'E-commerce Engine', href: '#products' },
    ]
  },
  { 
    name: 'Career', 
    href: '#career',
    dropdown: [
      { name: 'Jobs', href: '#career' },
      { name: 'Internships', href: '#career' },
    ]
  },
  { 
    name: 'Institute', 
    href: '#institute',
    dropdown: [
      { name: 'S.J IT Institute', href: '#institute' },
      { name: 'Code with Manexra', href: '#code-panel' },
    ]
  },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-md' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 group">
          <div className="h-16 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
            <img 
              src="/clogo.png" 
              alt="Manexra Logo" 
              className="h-full w-auto object-contain" 
            />
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative group"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={link.href}
                className="text-sm font-semibold text-gray-700 hover:text-ai-primary transition-colors flex items-center gap-1 py-2"
              >
                {link.name}
                {link.dropdown && <ChevronDown className="w-4 h-4" />}
              </a>
              
              {link.dropdown && activeDropdown === link.name && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 mt-1 overflow-hidden">
                  {link.dropdown.map((sub) => (
                    <a
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-ai-primary transition-colors"
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 3-Dot Menu for Admin */}
          <div 
            className="relative"
            onMouseEnter={() => setShowMore(true)}
            onMouseLeave={() => setShowMore(false)}
          >
            <button className="p-2 text-gray-500 hover:text-ai-primary transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showMore && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-2 mt-1 overflow-hidden"
                >
                  <a
                    href="#admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-ai-primary transition-colors"
                  >
                    <Lock className="w-4 h-4" /> Admin Panel
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#admin"
            className="hidden lg:flex items-center gap-2 bg-white border border-ai-secondary text-ai-secondary px-5 py-2 rounded-full font-bold text-sm hover:bg-ai-secondary hover:text-white transition-all shadow-sm"
          >
            <Lock className="w-4 h-4" /> Admin Login
          </a>

          <a
            href="#test-system"
            className="bg-ai-secondary text-white px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-ai-secondary/20"
          >
            Take a Test
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 lg:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col">
                  <a
                    href={link.href}
                    onClick={() => !link.dropdown && setIsOpen(false)}
                    className="text-lg font-bold text-gray-800 hover:text-ai-primary py-2 flex justify-between items-center"
                  >
                    {link.name}
                  </a>
                  {link.dropdown && (
                    <div className="pl-4 border-l-2 border-gray-100 flex flex-col gap-2 mb-2">
                      {link.dropdown.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm text-gray-500 hover:text-ai-primary py-1"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="#test-system"
                onClick={() => setIsOpen(false)}
                className="bg-ai-secondary text-white px-5 py-3 rounded-xl font-bold text-center mt-4 shadow-lg"
              >
                Take a Test
              </a>
              <a
                href="#admin"
                onClick={() => setIsOpen(false)}
                className="bg-white border border-ai-secondary text-ai-secondary px-5 py-3 rounded-xl font-bold text-center mt-2 shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Admin Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
