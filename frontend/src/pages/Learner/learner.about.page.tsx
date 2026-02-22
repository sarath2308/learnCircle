import React from "react";
import { Users, Globe, Zap, ShieldCheck, Target, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
            Our Mission
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Bridging the gap between <span className="text-blue-600">Knowledge</span> and{" "}
            <span className="text-blue-600">Action</span>.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            LearnCircle is a global ecosystem designed for professionals to master high-demand
            skills through live mentorship and peer-to-peer collaboration.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem label="Active Students" value="50K+" />
            <StatItem label="Expert Mentors" value="1,200+" />
            <StatItem label="Courses" value="350+" />
            <StatItem label="Success Rate" value="94%" />
          </div>
        </div>
      </section>

      {/* Core Values - The "Circle" Philosophy */}
      <section className="py-20 bg-slate-900 text-white rounded-t-[3rem] mt-10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4">The LearnCircle Philosophy</h2>
            <p className="text-slate-400">Why thousands of professionals choose our platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ValueCard
              icon={<Target className="text-blue-400" size={32} />}
              title="Impact Driven"
              description="We don't teach theory. We teach what works in the real world, focusing on skills that lead to career breakthroughs."
            />
            <ValueCard
              icon={<Users className="text-purple-400" size={32} />}
              title="Community First"
              description="Learning is a circle. Our students become mentors, and our mentors never stop learning from the community."
            />
            <ValueCard
              icon={<Zap className="text-yellow-400" size={32} />}
              title="Live & Interactive"
              description="Recorded videos aren't enough. We prioritize live sessions, Q&As, and hands-on workshops."
            />
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 max-w-5xl mx-auto px-8 text-center">
        <h3 className="text-2xl font-bold mb-12">Trusted by Professionals Globally</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-start gap-4 text-left">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-800">Verified Instructors</h4>
              <p className="text-slate-500 mt-1">
                Every mentor on LearnCircle undergoes a rigorous background and expertise check.
              </p>
            </div>
          </div>
          <div className="p-8 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-start gap-4 text-left">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Globe className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-800">Global Accessibility</h4>
              <p className="text-slate-500 mt-1">
                Join the circle from anywhere in the world, with content localized for your growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-24 text-center">
        <div className="bg-blue-600 max-w-4xl mx-auto p-12 rounded-[2rem] shadow-2xl shadow-blue-200">
          <h2 className="text-3xl font-black text-white mb-6">Ready to join the circle?</h2>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Explore Courses
            </button>
            <button className="bg-blue-700 text-white border border-blue-500 px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">
              Become a Mentor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sub-components
const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-4xl font-black text-slate-900">{value}</p>
    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mt-1">{label}</p>
  </div>
);

const ValueCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-6">{icon}</div>
    <h4 className="text-xl font-bold mb-3">{title}</h4>
    <p className="text-slate-400 leading-relaxed text-sm md:text-base">{description}</p>
  </div>
);

export default AboutPage;
