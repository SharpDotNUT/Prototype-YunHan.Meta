import path from 'node:path'
import fs from 'node:fs'
import { addJSONToDist, SupportedLanguages } from '../utils.mjs'

let TextMap = {}

for (const lang of SupportedLanguages) {
  const D_AchievementData = JSON.parse(
    fs.readFileSync(
      path.join(
        import.meta.dirname,
        '../../Snap.Metadata-main/Genshin/' + lang.name + '/Achievement.json'
      ),
      'utf8'
    )
  )
  const D_AchievementGoalData = JSON.parse(
    fs.readFileSync(
      path.join(
        import.meta.dirname,
        '../../Snap.Metadata-main/Genshin/' +
          lang.name +
          '/AchievementGoal.json'
      ),
      'utf8'
    )
  )

  TextMap[lang.lang] = {}

  for (let achievementGoal of D_AchievementGoalData) {
    TextMap[lang.lang]['G-' + achievementGoal.Id] = achievementGoal.Name
  }
  for (let achievement of D_AchievementData) {
    TextMap[lang.lang]['AN-' + achievement.Id] = achievement.Title
    TextMap[lang.lang]['AD-' + achievement.Id] = achievement.Description
  }
}

let AchievementData = []
let GoalCount = 0
let GroupCount = 0
let AchievementCount = 0
let RewardCount = 0
let VersionSet = new Set()

const D_AchievementData = JSON.parse(
  fs.readFileSync(
    path.join(
      import.meta.dirname,
      '../../Snap.Metadata-main/Genshin/CHS/Achievement.json'
    ),
    'utf8'
  )
)
const D_AchievementGoalData = JSON.parse(
  fs.readFileSync(
    path.join(
      import.meta.dirname,
      '../../Snap.Metadata-main/Genshin/CHS/AchievementGoal.json'
    ),
    'utf8'
  )
)

for (let achievementGoal of D_AchievementGoalData) {
  AchievementData.push({
    id: achievementGoal.Id,
    order: achievementGoal.Order,
    name: 'G-' + achievementGoal.Id,
    versions: (VersionSet = new Set()),
    numberOfAchievements: 0,
    numberOfGroups: 0,
    achievementGroups: []
  })
  GoalCount += 1
}

const Names = new Set()
for (let Achievement of D_AchievementData) {
  const AchievementGoal = AchievementData.find(
    (goal) => goal.id === Achievement.Goal
  )
  function getAchievementData(achievement) {
    return {
      id: achievement.Id,
      description: 'AD-' + achievement.Id,
      rewards: achievement.FinishReward.Count
    }
  }
  if (Names.has(Achievement.Title)) {
    AchievementGoal.achievementGroups[
      AchievementGoal.achievementGroups.length - 1
    ].achievements.push(getAchievementData(Achievement))
  } else {
    AchievementGoal.achievementGroups.push({
      name: 'AN-' + Achievement.Id,
      version: Achievement.Version,
      achievements: [getAchievementData(Achievement)]
    })
    Names.add(Achievement.Title)
    VersionSet.add(Achievement.Version)
    GroupCount += 1
    AchievementGoal.numberOfGroups += 1
    AchievementGoal.versions.add(Achievement.Version)
  }
  RewardCount += Achievement.FinishReward.Count
  AchievementCount += 1
  AchievementGoal.numberOfAchievements += 1
}

for (let achievementGoal of AchievementData) {
  achievementGoal.versions = sortVersions(Array.from(achievementGoal.versions))
}

function sortVersions(versions) {
  return versions.sort((a, b) => {
    const aParts = a.split('.').map(Number)
    const bParts = b.split('.').map(Number)
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0
      const bPart = bParts[i] || 0
      if (aPart < bPart) return -1
      if (aPart > bPart) return 1
    }
    return 0
  })
}

const data = {
  numberOfGoals: GoalCount,
  numberOfGroups: GroupCount,
  numberOfAchievements: AchievementCount,
  numberOfRewards: RewardCount,
  versions: sortVersions(Array.from(VersionSet)),
  data: AchievementData
}

Object.keys(TextMap).forEach((lang) => {
  addJSONToDist('achievement_text_map-' + lang, TextMap[lang])
})
addJSONToDist(`achievement_meta`, data)

console.log(`Achievement - 全部完成`)
