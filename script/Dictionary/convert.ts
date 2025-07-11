import { MultiLanguage, Word } from './types'
import Rename from './rename.json'

export function convertGIFormat(data: any[]): Word[] {
  return data.map((item) => {
    const word: Word = {
      id: item.id,
      text: {
        en: item.en,
        ja: item.ja,
        'zh-Hans': item.zhCN, // Fallback to empty string if not present
        'zh-Hant': item.zhTW // Fallback to empty string if not present
      },
      note: {
        en: item.notesEn || item.notes, // Use notesEn or notes if available
        ja: item.notes,
        'zh-Hans': item.notesZh,
        'zh-Hant': item.notesZhTW
      },
      variant: {
        en: item.variants?.en?.[0], // Take first variant if exists
        ja: item.variants?.ja?.[0],
        'zh-Hans': item.variants?.zhCN?.[0],
        'zh-Hant': item.variants?.zhTW?.[0]
      },
      pronunciationJa: item.pronunciationJa,
      pinyinZHS: (item.pinyins || []).reduce(
        (acc: Record<string, string>, curr: any) => {
          acc[curr.char] = curr.pron
          return acc
        },
        {}
      ),
      zhuyinZHT: (item.zhuyins || []).reduce(
        (acc: Record<string, string>, curr: any) => {
          acc[curr.char] = curr.pron
          return acc
        },
        {}
      ),
      tags: (item.tags || []).map((tag: string) => Rename[tag]) || [],
      updatedAt: item.updatedAt,
      createdAt: item.createdAt
    }

    // Clean up empty note fields
    Object.keys(word.note).forEach((key) => {
      if (!word.note[key as keyof Partial<MultiLanguage>]) {
        delete word.note[key as keyof Partial<MultiLanguage>]
      }
    })

    // Clean up empty variant fields
    Object.keys(word.variant).forEach((key) => {
      if (!word.variant[key as keyof Partial<MultiLanguage>]) {
        delete word.variant[key as keyof Partial<MultiLanguage>]
      }
    })

    return word
  })
}
