
import React from 'react';
import { BMIResult } from '../types';

interface Props {
  result: BMIResult;
}

const BMIChart: React.FC<Props> = ({ result }) => {
  const segments = [
    { label: 'Underweight', min: 0, max: 18.5, color: '#3b82f6' },
    { label: 'Normal', min: 18.5, max: 25, color: '#22c55e' },
    { label: 'Overweight', min: 25, max: 30, color: '#eab308' },
    { label: 'Obese', min: 30, max: 40, color: '#ef4444' },
  ];

  const clampedBMI = Math.min(Math.max(result.bmi, 10), 40);
  const percentage = ((clampedBMI - 10) / (40 - 10)) * 100;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[280px] h-32 flex items-end overflow-hidden mb-4">
        <div className="absolute inset-x-0 bottom-0 h-4 bg-slate-100 rounded-full overflow-hidden flex">
          {segments.map((s, i) => (
             <div 
               key={i} 
               style={{ 
                 width: i === 0 ? '28.3%' : i === 1 ? '21.7%' : i === 2 ? '16.7%' : '33.3%',
                 backgroundColor: s.color,
                 opacity: 0.8
               }} 
               className="h-full"
             />
          ))}
        </div>
        <div 
          className="absolute bottom-0 w-1 h-8 bg-slate-900 shadow-lg rounded-full transition-all duration-700 ease-out z-10"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
            YOU
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className={`text-5xl font-extrabold mb-1 ${result.color}`}>
          {result.bmi.toFixed(1)}
        </div>
        <div className="text-slate-500 font-medium uppercase tracking-widest text-xs">
          Your BMI Index
        </div>
        <div className={`mt-2 font-bold text-lg ${result.color}`}>
          {result.category}
        </div>
      </div>
    </div>
  );
};

export default BMIChart;
