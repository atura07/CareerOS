import { httpClient } from './httpClient'
import { ENDPOINTS } from './endpoints'

export interface GreetingData {
  name: string
  timeGreeting: string
  subtitle: string
}

export interface PlacementReadinessData {
  available: boolean
  score: number | null
  status: 'NOT_ENOUGH_DATA' | 'GETTING_STARTED' | 'BUILDING_MOMENTUM' | 'DEVELOPING' | 'INTERVIEW_READY'
  statusLabel: string
  message: string
  requiredMilestones?: string[]
  completedMilestonesCount: number
  totalMilestonesCount: number
  strongestArea?: string | null
  areaNeedingAttention?: string | null
  recommendedNextAction?: string | null
}

export interface JourneyCardStatus {
  key: string
  title: string
  state: string
  stateLabel: string
  primaryMetric: string
  subtitle: string
  ctaLabel: string
  ctaLink: string
  isCompleted: boolean
}

export interface JourneyStatusData {
  resume: JourneyCardStatus
  dsa: JourneyCardStatus
  mockInterview: JourneyCardStatus
  github: JourneyCardStatus
  applications: JourneyCardStatus
}

export interface NextActionData {
  id: string
  title: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  category: string
  ctaLabel: string
  ctaLink: string
  icon: string
}

export interface RecentActivityData {
  id: string
  title: string
  description: string
  type: string
  timestamp: string
  relativeTime: string
  link: string
}

export interface ProfileCompletionData {
  percentage: number
  completedFieldsCount: number
  totalFieldsCount: number
  fields: {
    name: string
    completed: boolean
  }[]
}

export interface ConsistencyData {
  activeDaysCount: number
  message: string
  quote: string
  ctaLabel: string
  ctaLink: string
}

export interface DashboardSummaryResponse {
  greeting: GreetingData
  placementReadiness: PlacementReadinessData
  journey: JourneyStatusData
  nextActions: NextActionData[]
  recentActivity: RecentActivityData[]
  profileCompletion: ProfileCompletionData
  consistency: ConsistencyData
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await httpClient.get<DashboardSummaryResponse>(ENDPOINTS.DASHBOARD_SUMMARY)
    return response.data
  },
}
