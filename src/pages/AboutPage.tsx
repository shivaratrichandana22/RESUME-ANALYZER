import React from 'react';
import { FileText, ShieldAlert, Cpu } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div id="about-page" className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Architecture</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Learn how our AI parser processes documents to evaluate corporate readiness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Parsing technology */}
        <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Multi-format Document Extraction</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Our backend utilizes specialized parsers. For PDFs, <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-blue-300 text-xs font-mono">pdf-parse</code> decodes binary layers. For Word Documents, <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-blue-300 text-xs font-mono">mammoth</code> extracts semantic tags and formatting to reconstruct raw, readable text stream.
          </p>
        </div>

        {/* Gemini engine */}
        <div className="p-6 rounded-2xl glass-card glass-card-hover space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Gemini 3.5 Semantic Parsing</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Rather than relying on primitive keyword lookup matches, our system passes the raw extracted text straight to the advanced <code className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-xs font-bold font-mono">gemini-3.5-flash</code> model. This enables complex semantic recognition of roles, education, skills, and timelines.
          </p>
        </div>
      </div>

      {/* Deep Dive analysis */}
      <div className="rounded-3xl glass-card p-8 space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight">How the Scores are Calculated</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Recruiting systems use parsing algorithms to filter hundreds of candidates. We emulate this using three main dimensions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h4 className="font-extrabold text-blue-400 text-xs uppercase tracking-wider">1. ATS Compatibility</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Based on keyword matching. Evaluates how dense high-relevance technical skills are compared to standard benchmarks in your target market.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-emerald-400 text-xs uppercase tracking-wider">2. Resume Quality</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Reviews content tone, grammatical correctness, active verbs usage, professional statement clarity, and qualitative experience summaries.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-violet-400 text-xs uppercase tracking-wider">3. Structural Formatting</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ensures sections are organized logically (Education, Experience, Skills), pages and word counts are optimal, and contact information is clean.
            </p>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-4 text-xs text-slate-400">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white">Strict Privacy and In-Memory Data Integrity</h4>
          <p className="leading-relaxed">
            All file uploads are processed entirely in-memory using Node.js buffers. The parsed document content is immediately disposed of once analysis succeeds. No files are ever saved or written to persistent filesystems, ensuring absolute confidentiality.
          </p>
        </div>
      </div>
    </div>
  );
};
