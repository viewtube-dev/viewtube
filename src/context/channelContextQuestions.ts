export type ContextQuestionCategory = "identity" | "goals" | "audience" | "content" | "brand" | "intelligence"

export interface ChannelContextQuestion {
  id: string
  category: ContextQuestionCategory
  title: string
  description?: string
  required: boolean
  contextField: string
  evidenceWeight: number
}

export const CHANNEL_CONTEXT_QUESTIONS: ChannelContextQuestion[] = [
  { id: "channel_name", category: "identity", title: "What is your channel name?", description: "Use the exact display name of the channel currently active in Brain; mismatched names are withheld from prompts.", required: true, contextField: "identity.name", evidenceWeight: 1 },
  { id: "channel_description", category: "identity", title: "Describe your channel in one sentence.", required: true, contextField: "identity.description", evidenceWeight: 1 },
  { id: "primary_niche", category: "identity", title: "What is your primary niche?", required: true, contextField: "identity.niche", evidenceWeight: 1 },
  { id: "sub_niches", category: "identity", title: "What sub-niches do you cover?", required: false, contextField: "identity.subNiches", evidenceWeight: 0.9 },
  { id: "competitors", category: "identity", title: "Who are your top competitors or inspiration channels?", required: false, contextField: "identity.competitors", evidenceWeight: 0.9 },
  { id: "primary_goal", category: "goals", title: "What is the primary goal of your channel?", required: true, contextField: "goals.primaryGoal", evidenceWeight: 1 },
  { id: "success_definition", category: "goals", title: "What does success look like in 12 months?", required: true, contextField: "goals.successDefinition", evidenceWeight: 1 },
  { id: "goal_priority_order", category: "goals", title: "Rank your growth, revenue, watch time, engagement, and authority goals.", required: false, contextField: "goals.priorityRanking", evidenceWeight: 0.9 },
  { id: "offers", category: "goals", title: "What products or services does your content support?", required: false, contextField: "goals.offers", evidenceWeight: 0.8 },
  { id: "cta", category: "goals", title: "What primary action should viewers take?", required: false, contextField: "goals.primaryCTA", evidenceWeight: 0.8 },
  { id: "ideal_viewer", category: "audience", title: "Describe your ideal viewer.", required: true, contextField: "audience.idealViewer", evidenceWeight: 1 },
  { id: "viewer_problem", category: "audience", title: "What problem do you help people solve?", required: true, contextField: "audience.problem", evidenceWeight: 1 },
  { id: "experience_level", category: "audience", title: "Is your audience beginner, intermediate, or advanced?", required: true, contextField: "audience.experienceLevel", evidenceWeight: 0.9 },
  { id: "transformation", category: "audience", title: "What transformation should viewers achieve?", required: true, contextField: "audience.transformation", evidenceWeight: 1 },
  { id: "segments", category: "audience", title: "Which audience segments matter most?", required: false, contextField: "audience.segments", evidenceWeight: 0.8 },
  { id: "content_types", category: "content", title: "What types of content do you publish?", required: true, contextField: "content.types", evidenceWeight: 1 },
  { id: "best_formats", category: "content", title: "Which formats work best for you?", required: false, contextField: "content.bestFormats", evidenceWeight: 0.8 },
  { id: "publish_frequency", category: "content", title: "How often do you publish?", required: true, contextField: "content.frequency", evidenceWeight: 1 },
  { id: "priority_themes", category: "content", title: "Which themes should AI prioritize?", required: false, contextField: "content.priorityThemes", evidenceWeight: 0.9 },
  { id: "blocked_themes", category: "content", title: "Which themes should AI avoid?", required: false, contextField: "content.blockedThemes", evidenceWeight: 0.9 },
  { id: "brand_voice", category: "brand", title: "How should the channel sound?", required: true, contextField: "brand.voice", evidenceWeight: 1 },
  { id: "style_influences", category: "brand", title: "Which creators have a similar style?", required: false, contextField: "brand.influences", evidenceWeight: 0.7 },
  { id: "creativity_scale", category: "brand", title: "How creative should AI be on a 1–10 scale?", required: true, contextField: "brand.creativity", evidenceWeight: 0.7 },
  { id: "allowed_sources", category: "intelligence", title: "Which evidence sources may AI use?", required: true, contextField: "intelligence.sources", evidenceWeight: 1 },
  { id: "enabled_capabilities", category: "intelligence", title: "Which AI capabilities should the Brain prioritize?", required: true, contextField: "intelligence.capabilities", evidenceWeight: 1 },
]
