import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ai-primary rounded-lg flex items-center justify-center">
              <Cpu className="text-tech-bg w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              SJ IT <span className="text-ai-primary">INSTITUTE</span>
            </span>
          </div>
          
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>

          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} SJ IT Institute. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
