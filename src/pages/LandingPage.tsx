import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, TrendingUp, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div id="landing-page" className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold tracking-wide mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Powered by Gemini 3.5 AI Engine</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Crack the ATS. <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Perfect Your Resume in Seconds.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mt-6 leading-relaxed">
          Upload your resume in PDF or Word format. Get instant ATS scores, identify critical missing skills, fix grammar, and download an optimized professional report.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Analyze Resume Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl transition-all duration-300"
          >
            <span>How it Works</span>
          </Link>
        </div>

        {/* Feature quick showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Full Text Extraction</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Accepts PDF and DOCX files. Extracts and processes rich sections, work experiences, projects, and academics flawlessly.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">ATS Keyword Gap Analysis</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Calculates keyword densities and compares your credentials with real industry requirements to list missing high-value skills.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Prose & Grammar Fixer</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Identifies weak action verbs and passive voice. Suggests strong sentence rewrites with clear explanations.
            </p>
          </div>
        </div>

        {/* Trust badge / metrics */}
        <div className="border-t border-slate-200/60 max-w-5xl mx-auto mt-20 pt-10 flex flex-wrap justify-around items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">100% Secure</div>
            <div className="text-sm text-slate-400 mt-1">In-memory data processing</div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">Under 5s</div>
            <div className="text-sm text-slate-400 mt-1">Average analysis duration</div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">Downloadable</div>
            <div className="text-sm text-slate-400 mt-1">Markdown scorecards & guides</div>
          </div>
        </div>
      </div>
    </div>
  );
};
