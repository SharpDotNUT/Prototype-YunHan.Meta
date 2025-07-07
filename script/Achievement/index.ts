import path from 'node:path'
import fs from 'node:fs'
import { addToDist, SupportedLanguages } from '../utils.ts'
import type {
  RawAchievement,
  RawAchievementGoal,
  ProcessedAchievement,
  ProcessedAchievementGoal,
  ProcessedAchievementGroup,
  TextMap
} from './types.ts'

// ---------------------- 工具函数 ----------------------
const readJsonFile = <T>(filePath: string): T => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    process.exit(1)
  }
}

const sortVersions = (versions: string[]): string[] => {
  return versions.sort((a, b) => {
    const aParts = a.split('.').map(Number)
    const bParts = b.split('.').map(Number)

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0
      const bVal = bParts[i] || 0
      if (aVal !== bVal) return aVal - bVal
    }
    return 0
  })
}

// ---------------------- 主逻辑 ----------------------
const dirname = import.meta.dirname as string
const TextMap: TextMap = {}

// 处理多语言文本映射
SupportedLanguages.forEach((lang) => {
  const basePath = path.join(
    dirname,
    `../../Snap.Metadata/Genshin/${lang.name}`
  )

  const achievements = readJsonFile<RawAchievement[]>(
    path.join(basePath, 'Achievement.json')
  )
  const goals = readJsonFile<RawAchievementGoal[]>(
    path.join(basePath, 'AchievementGoal.json')
  )

  const langEntries: { [key: string]: string } = {}

  // 处理成就目标名称
  goals.forEach(({ Id, Name }) => {
    langEntries[`G-${Id}`] = Name
  })

  // 处理成就标题和描述
  achievements.forEach(({ Id, Title, Description }) => {
    langEntries[`AN-${Id}`] = Title
    langEntries[`AD-${Id}`] = Description
  })

  TextMap[lang.lang] = langEntries
})

// 处理中文数据结构
const processChineseData = () => {
  const basePath = path.join(dirname, '../../Snap.Metadata/Genshin/CHS')
  const achievements = readJsonFile<RawAchievement[]>(
    path.join(basePath, 'Achievement.json')
  )
  const goals = readJsonFile<RawAchievementGoal[]>(
    path.join(basePath, 'AchievementGoal.json')
  )

  // 初始化处理后的成就目标
  const processedGoals: ProcessedAchievementGoal[] = goals.map((goal) => ({
    id: goal.Id,
    order: goal.Order,
    name: `G-${goal.Id}`,
    versions: new Set<string>(),
    numberOfAchievements: 0,
    numberOfGroups: 0,
    achievementGroups: []
  }))

  const titleRegistry = new Set<string>()
  let globalStats = {
    rewards: 0,
    achievements: 0,
    groups: 0,
    versions: new Set<string>()
  }

  achievements.forEach((achievement) => {
    const parentGoal = processedGoals.find((g) => g.id === achievement.Goal)
    if (!parentGoal) {
      console.warn(
        `成就 ${achievement.Id} 引用了不存在的目标ID: ${achievement.Goal}`
      )
      return
    }

    // 创建成就对象
    const processedAchievement: ProcessedAchievement = {
      id: achievement.Id,
      description: `AD-${achievement.Id}`,
      rewards: achievement.FinishReward.Count,
      progress: achievement.Progress
    }

    // 处理成就分组逻辑
    if (titleRegistry.has(achievement.Title)) {
      const lastGroup = parentGoal.achievementGroups.at(
        -1
      ) as ProcessedAchievementGroup
      lastGroup.achievements.push(processedAchievement)
      lastGroup.finalProgress = processedAchievement.progress
    } else {
      parentGoal.achievementGroups.push({
        name: `AN-${achievement.Id}`,
        version: achievement.Version,
        achievements: [processedAchievement],
        showCount: !achievement.IsDeleteWatcherAfterFinish,
        finalProgress: processedAchievement.progress
      })
      titleRegistry.add(achievement.Title)
      parentGoal.versions.add(achievement.Version)
      parentGoal.numberOfGroups++
      globalStats.groups++
    }

    // 更新统计信息
    parentGoal.numberOfAchievements++
    globalStats.achievements++
    globalStats.rewards += achievement.FinishReward.Count
    parentGoal.versions.add(achievement.Version)
    globalStats.versions.add(achievement.Version)
  })

  // 最终数据结构处理
  return {
    data: processedGoals.map((goal) => ({
      ...goal,
      versions: sortVersions(Array.from(goal.versions))
    })),
    stats: {
      numberOfGoals: processedGoals.length,
      numberOfGroups: globalStats.groups,
      numberOfAchievements: globalStats.achievements,
      numberOfRewards: globalStats.rewards,
      versions: sortVersions(Array.from(globalStats.versions))
    }
  }
}

// ---------------------- 执行输出 ----------------------
const { data: achievementData, stats } = processChineseData()

Object.entries(TextMap).forEach(([lang, data]) => {
  addToDist('achievement/text-map', 'json', lang, JSON.stringify(data, null, 2))
})

// 保存主数据结构
addToDist(
  'achievement/meta',
  'json',
  undefined,
  JSON.stringify(
    {
      ...stats,
      data: achievementData
    },
    null,
    2
  )
)

console.log('成就数据处理完成 ✓')
