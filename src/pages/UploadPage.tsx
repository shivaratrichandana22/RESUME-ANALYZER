import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ResumeApi } from '../services/api.js';

export const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [stage, setStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Unsupported file format. Please upload a PDF (.pdf) or Word (.docx) file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadProgress(10);
    setStage('Extracting content and parsing headers...');

    try {
      // Simulate progress stages to make the SaaS experience premium
      const timer1 = setTimeout(() => {
        setUploadProgress(40);
        setStage('Formatting raw text lines...');
      }, 800);

      const timer2 = setTimeout(() => {
        setUploadProgress(70);
        setStage('Gemini 3.5 evaluating ATS scorecard and finding missing skills...');
      }, 1800);

      const timer3 = setTimeout(() => {
        setUploadProgress(90);
        setStage('Performing grammar critique and final report formatting...');
      }, 3500);

      const report = await ResumeApi.uploadResume(file, (progressEvent) => {
        // Handle actual network file upload progress if large
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (percent < 90) {
          setUploadProgress(Math.max(15, percent));
        }
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      setUploadProgress(100);
      setStage('Saving to database history!');

      setTimeout(() => {
        navigate(`/dashboard?id=${report.id}`);
      }, 600);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to upload and analyze your resume. Please try again.'
      );
      setLoading(false);
      setUploadProgress(0);
      setStage('');
    }
  };

  return (
    <div id="upload-page" className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Analyze a New Resume
        </h1>
        <p className="text-slate-400 mt-2">
          Upload your credentials to start your corporate quality report
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
        {loading ? (
          /* Processing State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin" />
              <FileText className="w-8 h-8 text-blue-400 absolute animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-white mt-8 tracking-tight">
              Analyzing Resume
            </h3>
            <p className="text-blue-400 text-sm font-semibold mt-1 uppercase tracking-widest animate-pulse">
              {uploadProgress}% completed
            </p>

            <div className="w-full max-w-md bg-white/10 h-2.5 rounded-full overflow-hidden mt-6 border border-white/5">
              <div
                className="bg-gradient-to-r from-blue-50 via-blue-400 to-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            <p className="text-slate-300 text-sm font-medium mt-4 max-w-sm italic">
              {stage}
            </p>
          </div>
        ) : (
          /* Upload Action State */
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-200 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Parsing Error:</span> {error}
                </div>
              </div>
            )}

            <div
              id="drop-zone"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                isDragActive
                  ? 'border-blue-400 bg-blue-500/10 scale-[0.99]'
                  : 'border-white/10 hover:border-blue-500/50 bg-white/2 hover:bg-white/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />

              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>

              {file ? (
                <div className="space-y-2">
                  <p className="text-white font-bold tracking-tight max-w-xs truncate mx-auto">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-tag-emerald text-xs font-semibold mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>File loaded successfully</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-slate-200 font-bold tracking-tight">
                    Drag and drop your file here, or{' '}
                    <span className="text-blue-400 hover:underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Supports PDF and DOCX (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-sm font-semibold transition-all duration-300"
                >
                  Clear File
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/10 transition-all duration-300"
                >
                  Analyze Resume
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Value statement card */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <RefreshCw className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">Real-Time Continuous Optimization</h4>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Every analysis automatically queries Gemini using tailored recruiting frameworks. We look for technical skill density, education compliance, active action verbs, and prose syntax to optimize your placement likelihood.
          </p>
        </div>
      </div>
    </div>
  );
};
