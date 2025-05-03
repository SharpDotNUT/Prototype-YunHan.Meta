interface Language {
  name: string
  lang: string
}

interface RawAchievement {
  Id: string
  Title: string
  Description: string
  Goal: string
  FinishReward: { Count: number }
  Progress: number
  Version: string
  IsDeleteWatcherAfterFinish: boolean
}

interface RawAchievementGoal {
  Id: string
  Name: string
  Order: number
}

interface ProcessedAchievement {
  id: string
  description: string
  rewards: number
  progress: number
}

export interface ProcessedAchievementGroup {
  name: string
  version: string
  achievements: ProcessedAchievement[]
  showCount: boolean
  finalProgress: number
}

interface ProcessedAchievementGoal {
  id: string
  order: number
  name: string
  versions: Set<string>
  numberOfAchievements: number
  numberOfGroups: number
  achievementGroups: ProcessedAchievementGroup[]
}

interface TextMap {
  [lang: string]: {
    [key: string]: string
  }
}

export type {
  RawAchievement,
  RawAchievementGoal,
  ProcessedAchievement,
  ProcessedAchievementGoal,
  TextMap
}
