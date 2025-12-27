
import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisResultView: React.FC<Props> = ({ result, onReset }) => {
  const chartData = [
    { name: 'Match', value: result.matchScore },
    { name: 'Gap', value: 100 - result.matchScore },
  ];

  const COLORS = ['#4f46e5', '#e2e8f0'];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Col: Score Circle */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Overall Match Score</h3>
          <div className="relative w-48 h-48">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-900">{result.matchScore}%</span>
              <span className="text-xs text-slate-500 font-medium">ATS Score</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed italic">
            "{result.roleFit}"
          </p>
          <button 
            onClick={onReset}
            className="mt-6 w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Analyze New Resume
          </button>
        </div>

        {/* Right Col: Detailed Breakdown */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Skill Gap Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 p-1 rounded">⚠️</span> Critical Skill Gaps
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-100">
                  {skill}
                </span>
              ))}
              {result.missingSkills.length === 0 && <p className="text-slate-500">No major skill gaps identified!</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-emerald-100 p-1 rounded">✅</span> Matching Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.matchingSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            🚀 Actionable Improvements
          </h3>
          <ul className="space-y-4">
            {result.suggestedImprovements.map((imp, idx) => (
              <li key={idx} className="border-l-4 border-indigo-400 pl-4 py-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{imp.category}</span>
                <p className="text-sm font-semibold text-slate-800 my-1">{imp.action}</p>
                <p className="text-xs text-slate-500">Why? {imp.impact}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            📄 Formatting & ATS Tips
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Layout & Design</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {result.formattingFeedback.map((tip, idx) => <li key={idx}>{tip}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">System Optimization</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {result.atsOptimization.map((tip, idx) => <li key={idx}>{tip}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultView;
