import React, { useState } from 'react';
import BMICalculator from './components/BMICalculator';
import BMIChart from './components/BMIChart';
import HealthTipsSection from './components/HealthTipsSection';
import { UserMetrics, BMIResult, AIResponse } from './types';
import { getHealthTips } from './services/geminiService';
import { generatePDFReport } from './services/pdfService';

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResultChange = (newResult: BMIResult, newMetrics: UserMetrics) => {
    setResult(newResult);
    setMetrics(newMetrics);
  };

  const generateAITips = async () => {
    if (!metrics || !result) return;
    
    setIsLoadingTips(true);
    setError(null);
    try {
      const data = await getHealthTips(metrics, result);
      setAiData(data);
    } catch (err: any) {
      setError(err.message || "Unable to generate health tips. Please check your connection.");
    } finally {
      setIsLoadingTips(false);
    }
  };

  const handleDownloadPDF = () => {
    if (metrics && result) {
      generatePDFReport(metrics, result, aiData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12h3L9 3l6 18 3-9h3" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Smart BMI Pro</h1>
            <h1 className="text-xl font-bold text-slate-800 sm:hidden">SBP</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500">
              "Mehmet Akif" School - Lipjan
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-400">
              • Enes Rexhaj and Blin Abdurrahmani
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Calculator */}
          <div className="lg:col-span-5 space-y-6">
            <BMICalculator onResult={handleResultChange} />
            {result && <BMIChart result={result} />}
            
            {result && (
              <div className="space-y-3">
                <button
                  onClick={generateAITips}
                  disabled={isLoadingTips}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {isLoadingTips ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <span>Generate AI Health Tips</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-slate-50 active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF Report</span>
                </button>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                <p className="text-red-600 text-sm font-semibold text-center">{error}</p>
                <p className="text-red-400 text-[10px] text-center mt-1">Check Vercel Settings -> Environment Variables</p>
              </div>
            )}
          </div>

          {/* Right Column: AI Feedback */}
          <div className="lg:col-span-7">
            {!aiData && !isLoadingTips ? (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Health Recommendations</h3>
                <p className="text-slate-500 max-w-xs">
                  Fill in your body metrics and click the button to get personalized wellness advice generated by Gemini AI.
                </p>
              </div>
            ) : (
              <HealthTipsSection data={aiData} loading={isLoadingTips} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-500 text-sm">
          Powered by Gemini 3 Flash. Built with React and Tailwind CSS.
        </p>
        <p className="text-slate-400 text-[10px] mt-2 max-w-md mx-auto">
          Disclaimer: This BMI calculator and the AI-generated tips are for informational purposes only and do not substitute professional medical advice, diagnosis, or treatment.
        </p>
      </footer>
    </div>
  );
};

export default App;