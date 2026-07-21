import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div id="landing-page" className="relative min-h-screen overflow-hidden py-12 md:py-20">
      {/* Ambient background blur circles */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-tag text-xs font-semibold tracking-wider uppercase mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Powered by Gemini 3.5 AI Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Crack the ATS. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
            Perfect Your Resume in Seconds.
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
          Upload your resume in PDF or Word format. Get instant ATS scores, identify critical missing skills, fix grammar, and download an optimized professional scorecard report.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] transition-all duration-300"
          >
            <span>Analyze Resume Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10 font-semibold rounded-xl backdrop-blur-md transition-all duration-300"
          >
            <span>How it Works</span>
          </Link>
        </div>

        {/* Feature quick showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="p-6 rounded-2xl glass-card glass-card-hover text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Full Text Extraction</h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                Accepts PDF and DOCX files. Extracts and processes rich sections, work experiences, projects, and academics flawlessly.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card glass-card-hover text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">ATS Keyword Gap Analysis</h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                Calculates keyword densities and compares your credentials with real industry requirements to list missing high-value skills.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card glass-card-hover text-left flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Prose & Grammar Fixer</h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                Identifies weak action verbs and passive voice. Suggests strong sentence rewrites with clear explanations.
              </p>
            </div>
          </div>
        </div>

        {/* Trust badge / metrics */}
        <div className="border-t border-white/10 max-w-5xl mx-auto mt-20 pt-10 flex flex-col sm:flex-row justify-around items-center gap-6">
          <div className="text-center sm:text-left">
            <div className="text-3xl font-extrabold text-white tracking-tight">100% Secure</div>
            <div className="text-sm text-slate-400 mt-1">In-memory data processing</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-3xl font-extrabold text-white tracking-tight">Under 5s</div>
            <div className="text-sm text-slate-400 mt-1">Average analysis duration</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-3xl font-extrabold text-white tracking-tight">Downloadable</div>
            <div className="text-sm text-slate-400 mt-1">Markdown scorecards & guides</div>
          </div>
        </div>
      </div>
    </div>
  );
};

