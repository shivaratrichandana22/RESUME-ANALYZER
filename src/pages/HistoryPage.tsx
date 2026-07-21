import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Trash2,
  Upload,
  Layers,
  Search,
  ExternalLink,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ResumeApi, IResumeReport } from '../services/api.js';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<IResumeReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ResumeApi.getHistory();
      setHistory(data);
    } catch (err: any) {
      console.error('Error fetching history:', err);
      setError('Failed to retrieve resume report history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to permanently delete this resume analysis from your history?')) {
      return;
    }

    try {
      await ResumeApi.deleteReport(id);
      setHistory((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete report:', err);
      alert('Error: Failed to delete resume record. Please try again.');
    }
  };

  const filteredHistory = history.filter((r) => {
    const candidateName = r.analysis.personalInfo.name || '';
    const filename = r.filename || '';
    return (
      candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div id="history-loading" className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 mt-4 font-semibold">Loading resume archives...</p>
      </div>
    );
  }

  return (
    <div id="history-container" className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Report Archives</h1>
          <p className="text-slate-400 mt-1">
            Access past ATS scores and strategic resume evaluations
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all duration-300"
        >
          <Upload className="w-4 h-4" />
          <span>Analyze New Resume</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 animate-bounce" />
          <span>{error}</span>
        </div>
      )}

      {history.length === 0 ? (
        /* Empty State */
        <div className="glass-card rounded-3xl p-16 text-center max-w-2xl mx-auto border border-white/5">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-6">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white">No Analysis History Found</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
            Your archives are empty. Upload your PDF or DOCX resume to perform your first automated ATS audit!
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all duration-300 mt-6"
          >
            <Upload className="w-4 h-4" />
            <span>Analyze Resume Now</span>
          </Link>
        </div>
      ) : (
        /* History Archive layout */
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name or filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-400 shadow-sm transition-all focus:outline-none"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl border border-white/5 text-slate-400">
              No reports matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredHistory.map((report) => {
                const { analysis } = report;
                return (
                  <div
                    key={report.id}
                    className="p-6 rounded-2xl glass-card glass-card-hover flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 font-bold uppercase text-xs font-mono">
                        {report.fileType}
                      </div>

                      <div className="space-y-1">
                        <Link
                          to={`/dashboard?id=${report.id}`}
                          className="font-extrabold text-white text-base tracking-tight hover:text-blue-400 transition-all block"
                        >
                          {analysis.personalInfo.name || 'Candidate'}
                        </Link>
                        <p className="text-xs text-slate-400 font-medium truncate max-w-sm md:max-w-md">
                          File: {report.filename}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 pt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Analyzed: {new Date(report.uploadedAt).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      {/* Scores summary */}
                      <div className="flex gap-6 text-center">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATS Match</div>
                          <div className={`text-lg font-extrabold mt-0.5 ${
                            analysis.atsScore >= 80 ? 'text-emerald-400' :
                            analysis.atsScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {analysis.atsScore}%
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality</div>
                          <div className="text-lg font-extrabold mt-0.5 text-blue-400">
                            {analysis.resumeScore}%
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Format</div>
                          <div className="text-lg font-extrabold mt-0.5 text-violet-400">
                            {analysis.formattingScore}%
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2.5 ml-auto">
                        <Link
                          to={`/dashboard?id=${report.id}`}
                          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all"
                          title="View Scorecard"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <a
                          href={ResumeApi.downloadReportUrl(report.id)}
                          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all"
                          title="Download Markdown Report"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 rounded-xl transition-all"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
