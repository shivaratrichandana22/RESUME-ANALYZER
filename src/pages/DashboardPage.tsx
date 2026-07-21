import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Upload,
  User,
  GraduationCap,
  Briefcase,
  Layers,
  CheckCircle,
  AlertTriangle,
  Code,
  Globe,
  Plus,
  ArrowLeft,
  Mail,
  Phone,
  Github,
  Linkedin,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { ResumeApi, IResumeReport } from '../services/api.js';
import { CircularGauge } from '../components/Gauges.js';

export const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [report, setReport] = useState<IResumeReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'prose' | 'resume'>('overview');

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await ResumeApi.getDetails(id);
          setReport(data);
        } else {
          // If no ID is specified, load the most recent report in history
          const history = await ResumeApi.getHistory();
          if (history && history.length > 0) {
            setReport(history[0]);
          } else {
            setReport(null);
          }
        }
      } catch (err: any) {
        console.error('Error fetching resume report:', err);
        setError('Failed to load resume analysis. Please verify your file or try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div id="dashboard-loading" className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 mt-4 font-semibold">Retrieving your analysis metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div id="dashboard-error" className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Error loading metrics</h3>
        <p className="text-slate-500 mt-2">{error}</p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all duration-300 mt-6"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resume instead</span>
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div id="dashboard-empty" className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No active reports</h3>
        <p className="text-slate-500 mt-2">
          You haven't uploaded or analyzed any resumes yet. Send us your PDF/DOCX to get started!
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all duration-300 mt-6 transform hover:-translate-y-0.5"
        >
          <Upload className="w-4 h-4" />
          <span>Analyze a Resume</span>
        </Link>
      </div>
    );
  }

  const { analysis, filename } = report;

  return (
    <div id="dashboard-container" className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Back button and Download bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-all mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to History</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Scorecard: {analysis.personalInfo.name || 'Candidate'}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200/60 font-medium font-mono uppercase">
              {report.fileType}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            File analyzed: <span className="font-semibold text-slate-600">{filename}</span> • Analyzed on:{' '}
            {new Date(report.uploadedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <a
            href={ResumeApi.downloadReportUrl(report.id)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100/60 font-semibold rounded-xl text-sm transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </a>
          <Link
            to="/analyze"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze New</span>
          </Link>
        </div>
      </div>

      {/* Visual Gauges */}
      <div id="gauges-row" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <CircularGauge score={analysis.atsScore} label="ATS Compatibility" subLabel="Matching Score" colorScheme="blue" />
        <CircularGauge score={analysis.resumeScore} label="Resume Score" subLabel="Visual & Prose" colorScheme="emerald" />
        <CircularGauge score={analysis.formattingScore} label="Formatting Quality" subLabel="Structure Match" colorScheme="violet" />
      </div>

      {/* Contact info card */}
      <div id="personal-info-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-wrap gap-y-4 gap-x-8 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
            {analysis.personalInfo.name ? analysis.personalInfo.name[0] : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{analysis.personalInfo.name || 'Candidate'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Parsed Contact Information</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{analysis.personalInfo.email || 'None parsed'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{analysis.personalInfo.phone || 'None parsed'}</span>
          </span>
          {analysis.personalInfo.github && (
            <a
              href={`https://${analysis.personalInfo.github.replace(/https?:\/\//i, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all text-blue-600"
            >
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub</span>
            </a>
          )}
          {analysis.personalInfo.linkedin && (
            <a
              href={`https://${analysis.personalInfo.linkedin.replace(/https?:\/\//i, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all text-blue-600"
            >
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              <span>LinkedIn</span>
            </a>
          )}
          {analysis.personalInfo.portfolio && (
            <a
              href={`https://${analysis.personalInfo.portfolio.replace(/https?:\/\//i, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all text-blue-600"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Portfolio</span>
            </a>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm transition-all ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Action Plan</span>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm transition-all ${
            activeTab === 'skills'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Keyword & Skill Gap</span>
        </button>
        <button
          onClick={() => setActiveTab('prose')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm transition-all ${
            activeTab === 'prose'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Rewrite & Grammar</span>
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm transition-all ${
            activeTab === 'resume'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Extracted Resume</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div id="tab-panels-container" className="pt-2">
        {/* TAB 1: OVERVIEW & IMPROVEMENTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Summary critique */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>AI Summary Critique & Recommended Revision</span>
                </h3>
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 text-sm leading-relaxed border border-slate-100">
                  {analysis.professionalSummary}
                </div>
              </div>

              {/* Action Plan improvements */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Strategic Improvements Checklist</span>
                </h3>
                <ul className="space-y-3">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/60 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">
                        {index + 1}
                      </span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right panel: formatting findings */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h4 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase mb-4">
                  Resume Metrics
                </h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                      <span>Pages</span>
                      <span className="text-slate-700">{analysis.resumeLength.pages}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                      <span>Word Count</span>
                      <span className="text-slate-700">{analysis.resumeLength.words} words</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 leading-relaxed italic mt-2">
                    {analysis.resumeLength.feedback}
                  </div>
                </div>
              </div>

              {/* Action Verbs Found */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h4 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase mb-3">
                  Parsed Action Verbs
                </h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Excellent dynamic verbs help bypass ATS automated filters and grab corporate interest.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.actionVerbs.map((verb, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KEYWORD & SKILL GAP ANALYSIS */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Horizontal progress indicators of density */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Keyword Density Analysis</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Primary focus terms found inside your resume text
                </p>
              </div>

              <div className="space-y-4">
                {analysis.keywordDensity.map((k, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">{k.keyword}</span>
                      <span className="text-slate-400 font-semibold font-mono">
                        {k.count} matches ({k.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-50 h-2.5 border border-slate-100 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, k.percentage * 40)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Analysis and Missing Skills */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>ATS Skills Gap Analysis</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  High-demand industry keywords missing from your content
                </p>
              </div>

              {analysis.missingSkills.length === 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-sm flex gap-3 items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Fantastic! No major technical keyword gaps were detected by our ATS analyzer.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/50 text-amber-800 border border-amber-100 rounded-2xl text-xs leading-relaxed">
                    Including these high-relevance terms inside your work experience descriptions or skills index will significantly increase search rankings with automatic matching parsers.
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {analysis.missingSkills.map((s, index) => (
                      <div
                        key={index}
                        className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WRITING & REWRITE SUGGESTIONS */}
        {activeTab === 'prose' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Spelling, Grammar, & Stylistic Suggestions</h3>
              <p className="text-slate-400 text-xs mt-1">
                Linguistic diagnostics and passive voice rewrites to professionalize your tone
              </p>
            </div>

            {analysis.grammarSuggestions.length === 0 ? (
              <div className="py-8 flex flex-col items-center text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                <h4 className="font-bold text-slate-800 text-sm">Prstine grammar detected!</h4>
                <p className="text-slate-500 text-xs mt-1">
                  Our system did not detect any passive phrasing or typos.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {analysis.grammarSuggestions.map((g, index) => (
                  <div
                    key={index}
                    className="p-5 border border-slate-100 rounded-2xl space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex gap-2 items-center text-xs font-bold text-slate-400 tracking-wide uppercase">
                      <span>Critique {index + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-400 tracking-wider uppercase block">
                          Current Sentence:
                        </span>
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 font-medium italic">
                          "{g.original}"
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-extrabold text-emerald-600 tracking-wider uppercase block">
                          Proposed Revision:
                        </span>
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 font-medium italic">
                          "{g.suggestion}"
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-100 rounded-xl text-xs text-slate-500 leading-relaxed">
                      <span className="font-bold text-slate-700">Linguistic justification:</span>{' '}
                      {g.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EXTRACTED TIMELINE / RESUME DETAILS */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reconstructed profile info */}
            <div className="space-y-6">
              {/* Skills summary */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide mb-4">
                  Extracted Skills Index
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>Academics</span>
                </h4>

                {analysis.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-3.5 space-y-1">
                    <h5 className="font-bold text-slate-800 text-xs">{edu.degree}</h5>
                    <p className="text-slate-500 text-xs">{edu.institution}</p>
                    <div className="flex gap-2 items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span>{edu.year}</span>
                      {edu.gpa && <span>• GPA: {edu.gpa}</span>}
                    </div>
                    {edu.details && <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{edu.details}</p>}
                  </div>
                ))}
              </div>

              {/* Certifications and Languages */}
              {(analysis.certifications || analysis.languages) && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
                  {analysis.certifications && analysis.certifications.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                        Certifications
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-500 list-disc pl-4">
                        {analysis.certifications.map((cert, i) => (
                          <li key={i}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.languages && analysis.languages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                        Languages
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-500 list-disc pl-4">
                        {analysis.languages.map((lang, i) => (
                          <li key={i}>{lang}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Experience and projects details */}
            <div className="md:col-span-2 space-y-6">
              {/* Work Experience timelines */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>Work Experience</span>
                </h4>

                <div className="relative border-l border-slate-100 pl-4 space-y-8 ml-2 pt-1">
                  {analysis.experience.map((exp, index) => (
                    <div key={index} className="relative space-y-2">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                        <div>
                          <h5 className="font-bold text-slate-800 text-sm">{exp.role}</h5>
                          <p className="text-xs text-slate-500 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md self-start sm:self-center">
                          {exp.duration}
                        </span>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reconstructed Projects */}
              {analysis.projects && analysis.projects.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                  <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Code className="w-4 h-4 text-slate-500" />
                    <span>Projects</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysis.projects.map((proj, index) => (
                      <div key={index} className="p-4 bg-slate-50/60 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h5 className="font-bold text-slate-800 text-xs tracking-tight">{proj.title}</h5>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{proj.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-4">
                          {proj.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
