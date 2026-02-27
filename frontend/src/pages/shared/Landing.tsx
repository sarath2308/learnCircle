"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Command, Cpu, Globe, MoveRight, Plus, Sparkles, Trophy } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* --- ELITE NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/60 backdrop-blur-2xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-2xl px-6 h-16">
          <div className="flex items-center gap-8">
            <div className="text-xl font-[1000] tracking-tighter text-blue-600 flex items-center gap-1">
              <div className="w-2 h-6 bg-blue-600 rounded-full" />
              learnCircle.
            </div>
            <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-all">
                Curriculum
              </a>
              <a href="#" className="hover:text-blue-600 transition-all">
                Faculty
              </a>
              <a href="#" className="hover:text-blue-600 transition-all">
                Outcomes
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="text-xs font-bold text-slate-500">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-6 text-xs font-bold transition-all duration-300">
                Join the Circle
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-32 lg:pt-48">
        {/* --- HERO SECTION --- */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-0">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles size={12} fill="currentColor" /> Admitting for 2026
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(3.5rem,10vw,8rem)] font-[1000] leading-[0.85] tracking-[-0.06em] text-slate-900 mb-12"
            >
              CRAFTING <br />
              <span className="text-blue-600 italic">ELITE</span> DEVS.
            </motion.h1>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end pb-12">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-500 font-medium leading-relaxed border-l-2 border-blue-600 pl-8 mb-8"
            >
              Not a school. A high-performance forge for engineers. We don't teach syntax; we build
              architects.
            </motion.p>
            <div className="flex gap-4">
              <Link to="/auth">
                <Button className="h-16 px-8 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/20 transition-all">
                  Get Started <MoveRight className="ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* --- ASYMMETRIC BENTO GRID --- */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
          {/* Card 1: Large Visual */}
          <div className="md:col-span-7 bg-white border border-slate-200 p-12 rounded-[3rem] flex flex-col justify-between min-h-[500px] shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Command size={32} />
              </div>
              <div className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                Live Workshop <br /> 04 / 12
              </div>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                Build. Deploy. <br />
                Scale. Repeat.
              </h3>
              <p className="text-slate-500 max-w-sm font-medium italic">
                "The curriculum is adjusted in real-time by AI to match your learning velocity."
              </p>
            </div>
          </div>

          {/* Card 2: Metrics */}
          <div className="md:col-span-5 grid grid-rows-2 gap-4">
            <div className="bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <Trophy size={40} className="mb-6 opacity-50" />
                <h4 className="text-2xl font-black">Top 1% Career Outcomes.</h4>
                <p className="text-blue-100 text-sm mt-2 font-medium">
                  Graduates hired by Stripe, Vercel, and Apple.
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 text-[12rem] font-black text-white/10 leading-none select-none">
                %
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex items-center justify-between">
              <div>
                <h4 className="text-4xl font-black tracking-tighter">24/7</h4>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                  Global Mentorship
                </p>
              </div>
              <Globe className="text-blue-500 w-12 h-12 animate-[spin_10s_linear_infinite]" />
            </div>
          </div>

          {/* Card 3: Feature Horizontal */}
          <div className="md:col-span-4 bg-white border border-slate-200 p-8 rounded-[3rem] flex flex-col items-center text-center justify-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Cpu size={24} className="text-slate-400" />
            </div>
            <h5 className="font-black text-xl mb-2">Neural Learning</h5>
            <p className="text-slate-400 text-sm font-medium">
              Personalized pathways generated by our proprietary LLM.
            </p>
          </div>

          <div className="md:col-span-8 bg-[#E2E8F0]/30 border border-white p-8 rounded-[3rem] flex items-center justify-between px-12">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg"
                >
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="avatar" />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                <Plus size={16} />
              </div>
            </div>
            <div className="text-right">
              <h5 className="text-2xl font-[1000] tracking-tighter">JOIN 14,000+</h5>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
                Active Engineers Worldwide
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- THE STRIPE-STYLE CTA --- */}
      <section className="py-32 container mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-[1000] tracking-tightest leading-none mb-12">
              READY TO <br /> <span className="text-blue-600 italic">TRANSCEND?</span>
            </h2>
            <Link to="/auth">
              <Button
                size="lg"
                className="h-24 px-16 bg-slate-900 hover:bg-blue-600 text-white rounded-3xl font-black text-2xl transition-all"
              >
                Apply for Admission
              </Button>
            </Link>
          </div>
          {/* Decorative blurred circles */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100/50 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-50 blur-[100px] rounded-full" />
        </div>
      </section>

      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-[1000] tracking-tighter text-blue-600">learnCircle.</div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <a href="#" className="hover:text-blue-600">
              Identity
            </a>
            <a href="#" className="hover:text-blue-600">
              Security
            </a>
            <a href="#" className="hover:text-blue-600">
              Philosophy
            </a>
          </div>
          <p className="text-xs font-bold text-slate-300">© 2026 LC SYSTEMS</p>
        </div>
      </footer>
    </div>
  );
}
