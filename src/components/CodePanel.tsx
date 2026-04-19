import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2, ChevronDown, Wand2, X, AlertCircle, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const INITIAL_LANGS = [
  { id: 'python', name: 'Python 3', extension: 'py', defaultCode: 'print("Hello, Manexra!")\n# Try writing some Python code here\nfor i in range(5):\n    print(f"Counting: {i}")' },
  { id: 'javascript', name: 'JavaScript', extension: 'js', defaultCode: 'console.log("Hello, Manexra!");\n// Try writing some JavaScript code here\nconst arr = [1, 2, 3];\nconsole.log("Array:", arr.map(x => x * 2));' },
  { id: 'c', name: 'C', extension: 'c', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, Manexra!\\n");\n    return 0;\n}' },
  { id: 'cpp', name: 'C++', extension: 'cpp', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, Manexra!" << std::endl;\n    return 0;\n}' },
  { id: 'java', name: 'Java', extension: 'java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Manexra!");\n    }\n}' },
];

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export default function CodePanel() {
  const [selectedLang, setSelectedLang] = useState(INITIAL_LANGS[0]);
  const [code, setCode] = useState(selectedLang.defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pyodide, setPyodide] = useState<any>(null);

  // Initialize Pyodide for Python support
  useEffect(() => {
    async function initPyodide() {
      if (window.loadPyodide) {
        try {
          const p = await window.loadPyodide();
          setPyodide(p);
          console.log('Pyodide loaded');
        } catch (err) {
          console.error('Pyodide load failed', err);
        }
      }
    }
    initPyodide();
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('Processing...\n');
    
    try {
      if (selectedLang.id === 'python') {
        if (!pyodide) {
          setOutput('Python engine (Pyodide) is still loading... Please wait a few seconds.');
          setIsRunning(false);
          return;
        }
        
        // Setup capture for stdout
        pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
        `);
        
        try {
          await pyodide.runPythonAsync(code);
          const stdout = pyodide.runPython("sys.stdout.getvalue()");
          const stderr = pyodide.runPython("sys.stderr.getvalue()");
          setOutput(stdout + (stderr ? `\nError:\n${stderr}` : ''));
        } catch (err: any) {
          setOutput(`Python Error:\n${err.message}`);
        }
      } 
      else if (selectedLang.id === 'javascript') {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
          originalLog(...args);
        };

        try {
          // Use Function instead of eval for better isolation
          new Function(code)();
          setOutput(logs.join('\n') || 'Program completed with no output.');
        } catch (err: any) {
          setOutput(`JavaScript Error:\n${err.message}`);
        } finally {
          console.log = originalLog;
        }
      }
      else {
        // C, C++, Java use AI-powered simulation as a fallback for the whitelisted Piston API
        setOutput('Connecting to Manexra AI Compiler...\n');
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `
          You are a professional ${selectedLang.name} compiler and runtime environment.
          Execute the following code and return the EXACT output it would produce in a standard terminal.
          
          Guidelines:
          - If there are syntax errors, provide clear compiler errors.
          - If the code is correct, provide only the stdout output.
          - If the code requires input (e.g. scanf, cin), simulate reasonable sample input but prioritize common test cases.
          
          LANGUAGE: ${selectedLang.name}
          CODE:
          \`\`\`${selectedLang.extension}
          ${code}
          \`\`\`
          
          Return your response as the raw terminal output.
        `;

        const result = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: prompt,
        });

        setOutput(result.text || 'No output from simulated compiler.');
      }
    } catch (err: any) {
      setError('Execution failed');
      setOutput(`Failed to execute code: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(selectedLang.defaultCode);
    setOutput('');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguageChange = (lang: typeof INITIAL_LANGS[0]) => {
    setSelectedLang(lang);
    setCode(lang.defaultCode);
    setOutput('');
    setShowLanguageDropdown(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex flex-col items-center">
      <div className="max-w-6xl w-full px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-ai-primary rounded-xl flex items-center justify-center shadow-lg shadow-ai-primary/20">
                <Code2 className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 leading-tight">Code with Manexra</h1>
            </div>
            <p className="text-gray-500 font-medium">Interactive coding environment for students</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-bold text-gray-700 hover:border-ai-primary transition-all"
              >
                {selectedLang.name}
                <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLanguageDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowLanguageDropdown(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20"
                    >
                      {INITIAL_LANGS.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => handleLanguageChange(lang)}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedLang.id === lang.id ? 'text-ai-primary bg-ai-primary/5' : 'text-gray-600'}`}
                        >
                          {lang.name}
                          {selectedLang.id === lang.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={runCode}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${isRunning ? 'bg-gray-300 cursor-not-allowed' : 'bg-ai-primary text-white hover:scale-105 active:scale-95 shadow-ai-primary/25'}`}
            >
              {isRunning ? (
                <>
                  <Play className="w-4 h-4 animate-pulse" />
                  Running...
                </>
              ) : (
                <>
                  {['c', 'cpp', 'java'].includes(selectedLang.id) ? <Sparkles className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {['c', 'cpp', 'java'].includes(selectedLang.id) ? 'AI Compile' : 'Run Code'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
          {/* Editor Section */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  main.{selectedLang.extension}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={copyCode}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button 
                  onClick={resetCode}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"
                  title="Reset code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full p-8 font-mono text-sm resize-none outline-none text-gray-800 bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2 flex flex-col bg-slate-900 border-l border-gray-100">
            <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 uppercase tracking-widest text-[10px] font-bold">
                <Terminal className="w-3.5 h-3.5" />
                Console Output
              </div>
              <button 
                onClick={() => setOutput('')}
                className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300 transition-colors"
                title="Clear console"
              >
                Clear
              </button>
            </div>
            
            <div className="flex-grow p-8 font-mono text-sm overflow-auto">
              <pre className={`whitespace-pre-wrap ${output.startsWith('Error') || output.startsWith('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                {output || '> Output will appear here after running the code...'}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Wand2 className="w-4 h-4" />
              <span>Free to use for all students</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.hash = '#institute'}
            className="text-gray-400 hover:text-ai-primary text-sm font-bold flex items-center gap-2 transition-colors"
          >
            ← Back to Institute
          </button>
        </div>
      </div>
    </div>
  );
}
