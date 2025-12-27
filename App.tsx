
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult } from './types';
import { analyzeResume } from './services/geminiService';
import Header from './components/Header';
import AnalysisResultView from './components/AnalysisResultView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    resumeText: '',
    jobDescription: '',
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setState(prev => ({ ...prev, resumeText: text }));
    };
    reader.readAsText(file); // Assume text files for prototype; in real apps we'd use PDF parser
  };

  const startAnalysis = async () => {
    if (!state.resumeText || !state.jobDescription) {
      setState(prev => ({ ...prev, error: "Please provide both a resume and a job description." }));
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const result = await analyzeResume(state.resumeText, state.jobDescription);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: err.message || "Something went wrong during analysis." 
      }));
    }
  };

  const resetAnalysis = () => {
    setState({
      resumeText: '',
      jobDescription: '',
      isAnalyzing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {state.result ? (
          <AnalysisResultView result={state.result} onReset={resetAnalysis} />
        ) : (
          <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Get Past the ATS Screen
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Stop guessing why you're getting rejected. Our AI analyzes your resume against any job description to give you actionable feedback in seconds.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Input Area */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">1. Your Resume</h3>
                  <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Upload File
                    <input type="file" className="hidden" accept=".txt,.md" onChange={handleFileUpload} />
                  </label>
                </div>
                <p className="text-xs text-slate-500">Paste your resume text below or upload a .txt file.</p>
                <textarea
                  className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm text-slate-700"
                  placeholder="Paste your professional experience, skills, and education here..."
                  value={state.resumeText}
                  onChange={(e) => setState(prev => ({ ...prev, resumeText: e.target.value }))}
                />
              </div>

              {/* JD Input Area */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800">2. Job Description</h3>
                <p className="text-xs text-slate-500">Paste the job description of the role you're applying for.</p>
                <textarea
                  className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm text-slate-700"
                  placeholder="Paste the full job requirements, responsibilities, and qualifications..."
                  value={state.jobDescription}
                  onChange={(e) => setState(prev => ({ ...prev, jobDescription: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              {state.error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm font-medium">
                  {state.error}
                </div>
              )}
              
              <button
                onClick={startAnalysis}
                disabled={state.isAnalyzing}
                className={`
                  w-full max-w-md py-4 px-8 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-200 transition-all duration-300
                  ${state.isAnalyzing 
                    ? 'bg-indigo-400 cursor-not-allowed text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] active:scale-95'}
                `}
              >
                {state.isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Match...
                  </span>
                ) : 'Run AI Matcher Analysis'}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
             <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold text-slate-900">ResumeIQ</h1>
              </div>
              <p className="text-sm text-slate-500 max-w-xs">
                Helping the next generation of talent bridge the gap between their skills and their dreams.
              </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li><a href="#" className="hover:text-indigo-600">Resume Templates</a></li>
              <li><a href="#" className="hover:text-indigo-600">Career Blog</a></li>
              <li><a href="#" className="hover:text-indigo-600">Skill Courses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
          © 2024 ResumeIQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
