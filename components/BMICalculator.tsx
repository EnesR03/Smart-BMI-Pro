
import React, { useState, useEffect } from 'react';
import { UnitSystem, UserMetrics, BMIResult } from '../types';

interface Props {
  onResult: (result: BMIResult, metrics: UserMetrics) => void;
}

const BMICalculator: React.FC<Props> = ({ onResult }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(UnitSystem.METRIC);
  const [name, setName] = useState<string>('');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [age, setAge] = useState<string>('25');
  const [gender, setGender] = useState<string>('male');

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    let bmiValue = 0;
    if (unitSystem === UnitSystem.METRIC) {
      // Metric: weight (kg) / [height (m)]^2
      bmiValue = w / ((h / 100) * (h / 100));
    } else {
      // Imperial: 703 * weight (lbs) / [height (in)]^2
      bmiValue = 703 * (w / (h * h));
    }

    let category = '';
    let color = '';

    if (bmiValue < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (bmiValue < 25) {
      category = 'Normal weight';
      color = 'text-green-500';
    } else if (bmiValue < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
    } else {
      category = 'Obese';
      color = 'text-red-500';
    }

    onResult(
      { bmi: bmiValue, category, color },
      { name, weight: w, height: h, unitSystem, age: parseInt(age), gender }
    );
  };

  // Re-calculate whenever inputs change
  useEffect(() => {
    calculateBMI();
  }, [name, weight, height, unitSystem, age, gender]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Enter Your Details</h2>

      <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setUnitSystem(UnitSystem.METRIC)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${unitSystem === UnitSystem.METRIC ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => setUnitSystem(UnitSystem.IMPERIAL)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${unitSystem === UnitSystem.IMPERIAL ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          Imperial (lb/in)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Weight ({unitSystem === UnitSystem.METRIC ? 'kg' : 'lbs'})</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Height ({unitSystem === UnitSystem.METRIC ? 'cm' : 'in'})</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
