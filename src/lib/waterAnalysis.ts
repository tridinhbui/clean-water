export interface WaterQualityResult {
  sampleId: string
  timestamp: Date
  location?: string
  parameters: {
    ph: {
      value: number
      status: 'safe' | 'caution' | 'unsafe'
      unit: 'pH'
      range: string
    }
    chlorine: {
      value: number
      status: 'safe' | 'caution' | 'unsafe'
      unit: 'ppm'
      range: string
    }
    turbidity: {
      value: number
      status: 'safe' | 'caution' | 'unsafe'
      unit: 'NTU'
      range: string
    }
    hardness: {
      value: number
      status: 'safe' | 'caution' | 'unsafe'
      unit: 'mg/L'
      range: string
    }
    iron: {
      value: number
      status: 'safe' | 'caution' | 'unsafe'
      unit: 'mg/L'
      range: string
    }
    bacteria: {
      value: number
      status: 'safe' | 'caution' | 'unsafe'
      unit: 'CFU/mL'
      range: string
    }
  }
  overallStatus: 'safe' | 'caution' | 'unsafe'
  safetyScore: number
  recommendations: string[]
  confidence: number
}

export const analyzeWaterSample = async (imageData?: string): Promise<WaterQualityResult> => {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

  // Generate realistic water quality data
  const ph = 6.5 + Math.random() * 2 // 6.5-8.5
  const chlorine = 0.2 + Math.random() * 1.3 // 0.2-1.5 ppm
  const turbidity = Math.random() * 5 // 0-5 NTU
  const hardness = 50 + Math.random() * 250 // 50-300 mg/L
  const iron = Math.random() * 0.5 // 0-0.5 mg/L
  const bacteria = Math.random() * 10 // 0-10 CFU/mL

  const getParameterStatus = (value: number, safe: [number, number], caution: [number, number]): 'safe' | 'caution' | 'unsafe' => {
    if (value >= safe[0] && value <= safe[1]) return 'safe'
    if ((value >= caution[0] && value < safe[0]) || (value > safe[1] && value <= caution[1])) return 'caution'
    return 'unsafe'
  }

  const parameters = {
    ph: {
      value: Number(ph.toFixed(1)),
      status: getParameterStatus(ph, [6.5, 8.5], [6.0, 9.0]),
      unit: 'pH' as const,
      range: '6.5-8.5 (optimal)'
    },
    chlorine: {
      value: Number(chlorine.toFixed(2)),
      status: getParameterStatus(chlorine, [0.2, 1.0], [0.1, 1.5]),
      unit: 'ppm' as const,
      range: '0.2-1.0 (safe)'
    },
    turbidity: {
      value: Number(turbidity.toFixed(1)),
      status: getParameterStatus(turbidity, [0, 1], [0, 4]),
      unit: 'NTU' as const,
      range: '< 1 (clear)'
    },
    hardness: {
      value: Number(hardness.toFixed(0)),
      status: getParameterStatus(hardness, [60, 120], [30, 180]),
      unit: 'mg/L' as const,
      range: '60-120 (moderate)'
    },
    iron: {
      value: Number(iron.toFixed(3)),
      status: getParameterStatus(iron, [0, 0.1], [0, 0.3]),
      unit: 'mg/L' as const,
      range: '< 0.1 (low)'
    },
    bacteria: {
      value: Number(bacteria.toFixed(0)),
      status: getParameterStatus(bacteria, [0, 0], [0, 5]),
      unit: 'CFU/mL' as const,
      range: '0 (none detected)'
    }
  }

  // Calculate overall status
  const statuses = Object.values(parameters).map(p => p.status)
  const unsafeCount = statuses.filter(s => s === 'unsafe').length
  const cautionCount = statuses.filter(s => s === 'caution').length
  
  let overallStatus: 'safe' | 'caution' | 'unsafe'
  if (unsafeCount > 0) {
    overallStatus = 'unsafe'
  } else if (cautionCount > 0) {
    overallStatus = 'caution'
  } else {
    overallStatus = 'safe'
  }

  // Calculate safety score (0-100)
  const safetyScore = Math.max(0, 100 - (unsafeCount * 30) - (cautionCount * 15))

  // Generate recommendations
  const recommendations: string[] = []
  if (parameters.ph.status !== 'safe') {
    recommendations.push('Consider pH adjustment - add buffer solution')
  }
  if (parameters.chlorine.status !== 'safe') {
    recommendations.push('Check chlorination system - may need adjustment')
  }
  if (parameters.turbidity.status !== 'safe') {
    recommendations.push('Improve filtration - high turbidity detected')
  }
  if (parameters.bacteria.status !== 'safe') {
    recommendations.push('Bacterial contamination detected - disinfection required')
  }
  if (recommendations.length === 0) {
    recommendations.push('Water quality is excellent - safe for consumption')
  }

  return {
    sampleId: Date.now().toString(36) + Math.random().toString(36).substr(2),
    timestamp: new Date(),
    location: 'Lab Sample',
    parameters,
    overallStatus,
    safetyScore,
    recommendations,
    confidence: 85 + Math.random() * 10 // 85-95%
  }
} 