
export enum UnitSystem {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL'
}

export interface UserMetrics {
  name: string;
  weight: number; // kg or lbs
  height: number; // cm or inches
  unitSystem: UnitSystem;
  age?: number;
  gender?: string;
}

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

export interface HealthTip {
  title: string;
  content: string;
  category: 'diet' | 'exercise' | 'lifestyle';
}

export interface AIResponse {
  tips: HealthTip[];
  summary: string;
}
