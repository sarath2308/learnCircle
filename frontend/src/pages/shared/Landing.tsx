"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle, Star, Zap, ShieldCheck, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* --- MODERN NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter text-blue-600">learnCircle.</div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-blue-600">
              Features
            </a>
            <a href="#testimonials" className="hover:text-blue-600">
              Success Stories
            </a>
            <a href="#pricing" className="hover:text-blue-600">
              Pricing
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/auth">
              <Button variant="ghost" className="font-bold">
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-bold shadow-lg shadow-blue-500/20">
                Join Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8"
          >
            <Zap size={14} /> The Future of Education
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
          >
            DON'T JUST LEARN.
            <br />
            <span className="text-blue-600 italic">EVOLVE.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium mb-10"
          >
            The only platform where industry experts mentor you in real-time. Build production-ready
            projects and get hired by top tech companies.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="h-16 px-10 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black font-black text-lg"
              >
                Get Started Now <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-8 rounded-2xl border-2 font-bold"
            >
              <PlayCircle className="mr-2" /> Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50/50 dark:bg-blue-950/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-12 border-y bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale contrast-125">
            {["Stripe", "Linear", "Vercel", "OpenAI", "Meta"].map((brand) => (
              <span key={brand} className="text-2xl font-black">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section id="features" className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-end min-h-[400px]">
            <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe size={28} />
            </div>
            <h3 className="text-4xl font-black tracking-tight mb-4">Live Worldwide Mentorship</h3>
            <p className="text-slate-400 max-w-md font-medium">
              Join students from over 140 countries. Our mentors are available 24/7 across every
              time zone.
            </p>
          </div>
          <div className="p-10 bg-blue-600 rounded-[3rem] text-white">
            <ShieldCheck size={48} className="mb-6 opacity-50" />
            <h3 className="text-3xl font-black mb-4 leading-tight">Verified Certificates</h3>
            <p className="text-blue-100 font-medium">
              Blockchain-backed credentials accepted by LinkedIn, Google, and Amazon.
            </p>
          </div>
          <div className="p-10 bg-slate-100 dark:bg-slate-900 rounded-[3rem]">
            <Star className="text-yellow-500 mb-6" size={40} fill="currentColor" />
            <h3 className="text-3xl font-black mb-4 leading-tight">Top Rated Instructors</h3>
            <p className="text-slate-500 font-medium">
              Learn from the top 1% of creators in the tech industry.
            </p>
          </div>
          <div className="md:col-span-2 p-10 border-2 border-slate-100 dark:border-slate-800 rounded-[3rem] flex items-center gap-12">
            <div className="hidden sm:block p-8 bg-slate-100 dark:bg-slate-800 rounded-3xl">
              <Zap size={64} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">AI-Powered Curriculums</h3>
              <p className="text-slate-500 font-medium">
                Our AI analyzes your progress and adjusts the difficulty in real-time. No more
                boring lectures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                READY TO SCALE YOUR
                <br />
                FUTURE?
              </h2>
              <Link to="/auth">
                <Button
                  size="lg"
                  className="h-20 px-12 rounded-full bg-white text-black hover:bg-slate-100 font-black text-xl shadow-2xl"
                >
                  Get Started for Free
                </Button>
              </Link>
            </div>
            {/* Background Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] rounded-full -mr-48 -mt-48" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-400">
            © 2026 learnCircle. High Performance Education.
          </p>
          <div className="flex gap-8 text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Careers</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
