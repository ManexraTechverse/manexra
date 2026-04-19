/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Technologies from './components/Technologies';
import Clients from './components/Clients';
import Institute from './components/Institute';
import SchoolProgram from './components/SchoolProgram';
import Contact from './components/Contact';
import TestSystem from './components/TestSystem';
import AdminPanel from './components/AdminPanel';
import Portfolio from './components/Portfolio';
import Products from './components/Products';
import Career from './components/Career';
import CodePanel from './components/CodePanel';
import Footer from './components/Footer';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#home');
    };
    window.addEventListener('hashchange', handleHashChange);
    // Handle initial load
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPath === '#admin') {
    return <AdminPanel />;
  }

  if (currentPath === '#test-system') {
    return (
      <div className="min-h-screen bg-white selection:bg-ai-primary selection:text-white">
        <Navbar />
        <TestSystem />
        <Contact />
        <Footer />
      </div>
    );
  }

  if (currentPath === '#career') {
    return (
      <div className="min-h-screen bg-white selection:bg-ai-primary selection:text-white">
        <Navbar />
        <div className="pt-20">
          <Career />
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPath === '#institute') {
    return (
      <div className="min-h-screen bg-white selection:bg-ai-primary selection:text-white">
        <Navbar />
        <div className="pt-20">
          <Institute />
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPath === '#code-panel') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <CodePanel />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-ai-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Technologies />
        <Clients />
        <Products />
        <SchoolProgram />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
