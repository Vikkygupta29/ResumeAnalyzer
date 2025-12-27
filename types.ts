
export interface AnalysisResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  formattingFeedback: string[];
  roleFit: string;
  suggestedImprovements: {
    category: string;
    action: string;
    impact: string;
  }[];
  atsOptimization: string[];
}

export interface AppState {
  resumeText: string;
  jobDescription: string;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
