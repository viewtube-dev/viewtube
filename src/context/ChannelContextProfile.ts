export interface ChannelContextProfile {
  identity: { name?: string; description?: string; niche?: string; subNiches?: string[]; competitors?: string[] }
  goals: { primaryGoal?: string; successDefinition?: string; priorityRanking?: string[]; offers?: string[]; primaryCTA?: string }
  audience: { idealViewer?: string; experienceLevel?: string; transformation?: string; problem?: string; segments?: string[] }
  content: { types?: string[]; frequency?: string; bestFormats?: string[]; priorityThemes?: string[]; blockedThemes?: string[]; recurringSeriesName?: string; recurringSeriesDescription?: string; biggestWeakness?: string; mostSuccessfulVideo?: string }
  brand: { voice?: string; influences?: string[]; creativity?: number }
  intelligence: { sources?: string[]; capabilities?: string[]; signupReason?: string }
}
