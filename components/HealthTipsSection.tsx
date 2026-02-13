
import React from 'react';
import { HealthTip, AIResponse } from '../types';

interface Props {
  data: AIResponse | null;
  loading: boolean;
}

const HealthTipsSection: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-24 bg-slate-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-slate-200 rounded-xl"></div>
          <div className="h-40 bg-slate-200 rounded-xl"></div>
          <div className="h-40 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'diet': return '🥗';
      case 'exercise': return '💪';
      case 'lifestyle': return '🌙';
      default: return '✨';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span>AI Wellness Summary</span>
        </h3>
        <p className="text-blue-800 leading-relaxed">
          {data.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.tips.map((tip, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:border-blue-200 transition-colors">
            <div className="text-3xl mb-4">{getCategoryIcon(tip.category)}</div>
            <h4 className="font-bold text-slate-800 mb-2">{tip.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{tip.content}</p>
            <div className="mt-auto pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {tip.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTipsSection;
