import { WaterMetrics } from './tensorflow';

export type SafetyLevel = 'safe' | 'caution' | 'unsafe';

export interface SafetyAssessment {
  overall: SafetyLevel;
  pH: SafetyLevel;
  chlorine: SafetyLevel;
  heavyMetal: SafetyLevel;
  turbidity: SafetyLevel;
  recommendations: string[];
}

export function assessWaterSafety(metrics: WaterMetrics): SafetyAssessment {
  const assessment: SafetyAssessment = {
    overall: 'safe',
    pH: 'safe',
    chlorine: 'safe',
    heavyMetal: 'safe',
    turbidity: 'safe',
    recommendations: [],
  };

  // pH assessment (WHO guidelines: 6.5-8.5)
  if (metrics.pH < 6.5 || metrics.pH > 8.5) {
    assessment.pH = 'unsafe';
    assessment.recommendations.push(
      metrics.pH < 6.5
        ? 'Water is too acidic. Consider water treatment.'
        : 'Water is too alkaline. Consider water treatment.'
    );
  } else if (metrics.pH < 7.0 || metrics.pH > 8.0) {
    assessment.pH = 'caution';
    assessment.recommendations.push('pH levels are acceptable but monitor regularly.');
  }

  // Chlorine assessment (WHO guidelines: 0.2-1.0 ppm)
  if (metrics.chlorine > 1.0) {
    assessment.chlorine = 'unsafe';
    assessment.recommendations.push('Chlorine levels too high. Avoid consumption.');
  } else if (metrics.chlorine < 0.2) {
    assessment.chlorine = 'caution';
    assessment.recommendations.push('Low chlorine may indicate insufficient disinfection.');
  }

  // Heavy metals (0-10 scale, >7 is concerning)
  if (metrics.heavyMetalScore > 7) {
    assessment.heavyMetal = 'unsafe';
    assessment.recommendations.push('High heavy metal contamination detected. Do not consume.');
  } else if (metrics.heavyMetalScore > 5) {
    assessment.heavyMetal = 'caution';
    assessment.recommendations.push('Moderate heavy metal levels. Consider filtration.');
  }

  // Turbidity assessment (WHO guidelines: <1 NTU ideal, <4 NTU acceptable)
  if (metrics.turbidity > 4) {
    assessment.turbidity = 'unsafe';
    assessment.recommendations.push('High turbidity. Water needs filtration before use.');
  } else if (metrics.turbidity > 1) {
    assessment.turbidity = 'caution';
    assessment.recommendations.push('Moderate turbidity. Consider filtration for drinking.');
  }

  // Overall assessment (worst of all categories)
  const levels = [assessment.pH, assessment.chlorine, assessment.heavyMetal, assessment.turbidity];
  if (levels.indexOf('unsafe') !== -1) {
    assessment.overall = 'unsafe';
  } else if (levels.indexOf('caution') !== -1) {
    assessment.overall = 'caution';
  }

  if (assessment.overall === 'safe') {
    assessment.recommendations.push('Water quality is within safe parameters.');
  }

  return assessment;
}

export function getSafetyColor(level: SafetyLevel): string {
  switch (level) {
    case 'safe':
      return 'text-green-600 bg-green-50';
    case 'caution':
      return 'text-yellow-600 bg-yellow-50';
    case 'unsafe':
      return 'text-red-600 bg-red-50';
  }
}

export function getSafetyBadgeColor(level: SafetyLevel): string {
  switch (level) {
    case 'safe':
      return 'bg-green-100 text-green-800';
    case 'caution':
      return 'bg-yellow-100 text-yellow-800';
    case 'unsafe':
      return 'bg-red-100 text-red-800';
  }
} 