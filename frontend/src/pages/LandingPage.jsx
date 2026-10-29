import React, { Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Code2, Cpu, Zap, Search, LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import the heavy WebGL component to keep the main bundle small
const TubesBackground = React.lazy(() => import('../components/TubesBackground'));

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E8EEF5] font-sans selection:bg-scanner-green/30 selection:text-white">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled ? 'bg-[#05070A]/90 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-4 sm:py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="text-[#00E5FF] w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-mono font-bold text-lg sm:text-xl tracking-tight text-white">CodeInsight</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6 text-sm font-medium text-[#7E8A97]">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#languages" className="hover:text-white transition-colors">Languages</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-[#7E8A97] hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="px-5 py-2 text-sm font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00E5FF]/50 text-white transition-all rounded-sm">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-white p-2 rounded-sm hover:bg-white/5 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#00E5FF]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[57px] bg-[#05070A]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <a href="#features" className="text-white font-medium hover:text-[#00E5FF] transition-colors py-1" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#languages" className="text-white font-medium hover:text-[#00E5FF] transition-colors py-1" onClick={() => setMobileMenuOpen(false)}>Languages</a>
            <a href="#how-it-works" className="text-white font-medium hover:text-[#00E5FF] transition-colors py-1" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              <Link to="/login" className="text-center py-2.5 text-white font-medium bg-white/5 hover:bg-white/10 rounded-sm transition-colors" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="text-center py-2.5 text-[#05070A] bg-[#00E5FF] hover:bg-[#00E5FF]/90 font-bold rounded-sm transition-colors" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center pt-24 pb-16 md:py-24 overflow-hidden">
        {/* 3D Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-[#05070A]"></div>}>
          <TubesBackground />
        </Suspense>

        {/* Hero Content overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 pointer-events-none">
          
          <div className="flex-1 text-center lg:text-left pointer-events-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 sm:mb-8">
              <div className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></div>
              <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#7CFF6B] uppercase">Analysis Engine Ready</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.15]">
              Find the problems.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7CFF6B]">Before they reach production.</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-[#7E8A97] mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Analyze JavaScript, Python and Java code for bugs, security risks, code smells and complexity — in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start mb-8">
              <Link to="/upload" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#05070A] font-bold transition-colors flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] text-sm sm:text-base">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                Analyze Your Code
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2 rounded-sm text-sm sm:text-base">
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                Explore Dashboard
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-[#7E8A97]"><span className="text-[#00E5FF]">[JS]</span> JavaScript</div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-[#7E8A97]"><span className="text-[#FFB84D]">[PY]</span> Python</div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-[#7E8A97]"><span className="text-[#FF4D6D]">[JV]</span> Java</div>
            </div>
          </div>

          {/* Floating Diagnostic Panel Signature Element */}
          <div className="hidden lg:block w-[380px] pointer-events-auto">
            <div className="bg-[#0B1117]/80 backdrop-blur-xl border border-white/10 p-6 rounded-sm shadow-2xl relative overflow-hidden animate-float">
              {/* Scan line effect */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent animate-scan"></div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-sm tracking-widest text-[#7E8A97]">CODE SCAN</span>
                <Activity className="w-4 h-4 text-[#00E5FF]" />
              </div>

              <div className="mb-8">
                <div className="flex justify-between font-mono text-sm mb-2">
                  <span className="text-white">Analysis Progress</span>
                  <span className="text-[#00E5FF]">82%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E5FF] w-[82%] rounded-full shadow-[0_0_10px_#00E5FF]"></div>
                </div>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-[#FF4D6D]" /> Critical</span>
                  <span className="text-[#FF4D6D]">01</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white flex items-center gap-2"><Activity className="w-4 h-4 text-[#FFB84D]" /> Warnings</span>
                  <span className="text-[#FFB84D]">04</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white flex items-center gap-2"><Code2 className="w-4 h-4 text-[#7E8A97]" /> Code Smells</span>
                  <span className="text-white">07</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-mono text-sm text-[#7E8A97]">Quality Score</span>
                <span className="font-mono text-3xl font-bold text-[#7CFF6B]">82</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What CodeInsight Checks */}
      <section id="features" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 border-t border-white/5 bg-[#0B1117] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-20"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Deep Diagnostics.</h2>
            <p className="text-base sm:text-lg text-[#7E8A97] max-w-2xl mx-auto">Our engine runs native static analysis across five crucial dimensions to ensure your code is enterprise-ready.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <div className="p-6 sm:p-8 border border-white/10 bg-[#05070A] group hover:border-[#FF4D6D]/50 transition-colors rounded-sm">
              <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF4D6D] mb-4 sm:mb-6" />
              <h3 className="font-mono text-lg sm:text-xl text-white mb-4 sm:mb-6 uppercase tracking-wider">Security</h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#7E8A97]">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#FF4D6D] shrink-0"/> Hardcoded secrets</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#FF4D6D] shrink-0"/> eval() execution</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#FF4D6D] shrink-0"/> Unsafe patterns</li>
              </ul>
            </div>
            
            <div className="p-6 sm:p-8 border border-white/10 bg-[#05070A] group hover:border-[#FFB84D]/50 transition-colors rounded-sm">
              <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFB84D] mb-4 sm:mb-6" />
              <h3 className="font-mono text-lg sm:text-xl text-white mb-4 sm:mb-6 uppercase tracking-wider">Bugs</h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#7E8A97]">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#FFB84D] shrink-0"/> Null dereference</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#FFB84D] shrink-0"/> Empty exception handling</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#FFB84D] shrink-0"/> Unreachable code</li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 border border-white/10 bg-[#05070A] group hover:border-[#00E5FF]/50 transition-colors rounded-sm">
              <Code2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#00E5FF] mb-4 sm:mb-6" />
              <h3 className="font-mono text-lg sm:text-xl text-white mb-4 sm:mb-6 uppercase tracking-wider">Code Quality</h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#7E8A97]">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#00E5FF] shrink-0"/> Unused variables</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#00E5FF] shrink-0"/> Magic numbers</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#00E5FF] shrink-0"/> Duplicate code</li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 border border-white/10 bg-[#05070A] group hover:border-[#7CFF6B]/50 transition-colors lg:col-span-1 md:col-span-2 rounded-sm">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-[#7CFF6B] mb-4 sm:mb-6" />
              <h3 className="font-mono text-lg sm:text-xl text-white mb-4 sm:mb-6 uppercase tracking-wider">Performance</h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#7E8A97]">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#7CFF6B] shrink-0"/> Inefficient loops</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#7CFF6B] shrink-0"/> Memory leaks</li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 border border-white/10 bg-[#05070A] group hover:border-white/50 transition-colors lg:col-span-2 md:col-span-2 rounded-sm">
              <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-white mb-4 sm:mb-6" />
              <h3 className="font-mono text-lg sm:text-xl text-white mb-4 sm:mb-6 uppercase tracking-wider">Complexity</h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#7E8A97]">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-white shrink-0"/> Cyclomatic complexity tracking</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-white shrink-0"/> Method length limits</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Supported Languages */}
      <section id="languages" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-20"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Multi-Language Native.</h2>
            <p className="text-base sm:text-lg text-[#7E8A97] max-w-2xl mx-auto">Built from the ground up to understand the AST and syntax of modern backend and frontend stacks.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            <div className="bg-[#0B1117] border border-white/10 rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#05070A]">
                <span className="font-mono text-sm text-white">app.js</span>
                <span className="font-mono text-xs text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 rounded-sm">JavaScript</span>
              </div>
              <div className="p-4 sm:p-6 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-sm text-[#7E8A97] leading-relaxed">
<span className="text-[#FF4D6D]">const</span> secret = <span className="text-[#7CFF6B]">"db_admin_123"</span>;<br/>
<span className="text-[#FF4D6D]">function</span> <span className="text-[#00E5FF]">analyze</span>(input) &#123;<br/>
&nbsp;&nbsp;<span className="text-[#FFB84D]">eval</span>(input); <span className="text-white/30">// PY-EVAL</span><br/>
&#125;
                </pre>
              </div>
            </div>

            <div className="bg-[#0B1117] border border-white/10 rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#05070A]">
                <span className="font-mono text-sm text-white">main.py</span>
                <span className="font-mono text-xs text-[#FFB84D] bg-[#FFB84D]/10 px-2 py-1 rounded-sm">Python</span>
              </div>
              <div className="p-4 sm:p-6 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-sm text-[#7E8A97] leading-relaxed">
<span className="text-[#FF4D6D]">def</span> <span className="text-[#00E5FF]">process</span>(data=[]):<br/>
&nbsp;&nbsp;<span className="text-[#FF4D6D]">try</span>:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#FFB84D]">print</span>(data) <span className="text-white/30"># PY-PRINT</span><br/>
&nbsp;&nbsp;<span className="text-[#FF4D6D]">except</span>:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#FF4D6D]">pass</span> <span className="text-white/30"># PY-BARE-EXCEPT</span>
                </pre>
              </div>
            </div>

            <div className="bg-[#0B1117] border border-white/10 rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#05070A]">
                <span className="font-mono text-sm text-white">Core.java</span>
                <span className="font-mono text-xs text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-1 rounded-sm">Java</span>
              </div>
              <div className="p-4 sm:p-6 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-sm text-[#7E8A97] leading-relaxed">
<span className="text-[#FF4D6D]">public class</span> <span className="text-white">Core</span> &#123;<br/>
&nbsp;&nbsp;<span className="text-[#FF4D6D]">public void</span> <span className="text-[#00E5FF]">init</span>() &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;String name = <span className="text-[#FF4D6D]">null</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;name.trim(); <span className="text-white/30">// JAVA-NULL</span><br/>
&nbsp;&nbsp;&#125;<br/>
&#125;
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-[#0B1117] border-t border-b border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-20"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">Pipeline Flow.</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>
            
            <div className="bg-[#05070A] border border-white/10 p-6 sm:p-8 w-full md:w-64 text-center relative z-10 rounded-sm">
              <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00E5FF]/20">
                <Code2 className="text-[#00E5FF] w-5 h-5" />
              </div>
              <h4 className="text-white font-bold mb-2">1. Input</h4>
              <p className="text-xs sm:text-sm text-[#7E8A97]">Upload a file or paste raw code directly into the editor.</p>
            </div>

            <div className="bg-[#05070A] border border-[#00E5FF]/50 shadow-[0_0_30px_rgba(0,229,255,0.1)] p-6 sm:p-8 w-full md:w-64 text-center relative z-10 rounded-sm">
              <div className="w-12 h-12 bg-[#00E5FF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#05070A]">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="text-white font-bold mb-2">2. Analyze</h4>
              <p className="text-xs sm:text-sm text-[#7E8A97]">The CodeInsight engine parses ASTs and executes rules.</p>
            </div>

            <div className="bg-[#05070A] border border-white/10 p-6 sm:p-8 w-full md:w-64 text-center relative z-10 rounded-sm">
              <div className="w-12 h-12 bg-[#7CFF6B]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#7CFF6B]/20">
                <LayoutDashboard className="text-[#7CFF6B] w-5 h-5" />
              </div>
              <h4 className="text-white font-bold mb-2">3. Report</h4>
              <p className="text-xs sm:text-sm text-[#7E8A97]">View actionable metrics and export diagnostic PDFs.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 text-center"
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to inspect your code?</h2>
        <p className="text-base sm:text-lg text-[#7E8A97] max-w-xl mx-auto mb-8 sm:mb-10">Create a free account to track your analysis history and generate detailed diagnostic reports.</p>
        <Link to="/signup" className="inline-flex px-8 py-3.5 sm:px-10 sm:py-5 bg-white text-[#05070A] font-bold text-base sm:text-lg hover:bg-gray-200 transition-colors rounded-sm">
          Get Started Now
        </Link>
      </motion.section>

      <footer className="py-6 sm:py-8 border-t border-white/10 text-center text-[#7E8A97] text-xs sm:text-sm px-4">
        <p>© {new Date().getFullYear()} CodeInsight Platform. College Project.</p>
      </footer>
    </div>
  );
}
