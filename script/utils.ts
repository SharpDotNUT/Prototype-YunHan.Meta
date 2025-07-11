import fs from 'fs/promises'
import path from 'path'
const dirname = import.meta.dirname as string
const filename = import.meta.filename as string
import crypto from 'node:crypto'
import { mkdir } from 'node:fs'

export const SupportedLanguages = [
  {
    name: 'CHS',
    lang: 'zh-Hans'
  },
  {
    name: 'EN',
    lang: 'en'
  },
  {
    name: 'JP',
    lang: 'ja'
  }
]

export interface StaticResourceMetaRecord {
  id: string
  ext: string
  descriptions?: { [lang: string]: string }
  externalUrl?: string
  hasVariants?: boolean
  variants?: string[]
  hash: string
  updatedAt: number
}

export interface StaticResourceMeta {
  updatedAt: number
  versionOfGenshin: string
  resources: Record<string, StaticResourceMetaRecord>
}

const Meta = path.join(dirname, '../data/meta.json')
let MetaData: StaticResourceMeta = JSON.parse(await fs.readFile(Meta, 'utf-8'))
MetaData.updatedAt = Date.now()
MetaData.versionOfGenshin = '5.7'

await fs.mkdir(path.join(dirname, '../data/res'), { recursive: true })

export async function addToDist(
  id: string,
  ext: string,
  variant: string | undefined,
  file: Buffer | string
) {
  let resPath = ''
  if (variant) {
    resPath = path.join(dirname, `../data/res/${id}/${variant}.${ext}`)
  } else {
    resPath = path.join(dirname, `../data/res/${id}.${ext}`)
  }
  if (MetaData.resources?.[id] && MetaData.resources[id].variants) {
    console.log(MetaData.resources?.[id])
    if (variant && !MetaData.resources[id].variants?.includes(variant)) {
      MetaData.resources[id].variants?.push(variant)
    }
  } else {
    MetaData.resources[id] = {
      id,
      ext,
      variants: variant ? [variant] : undefined,
      hash: crypto.createHash('md5').update(file).digest('hex'),
      updatedAt: Date.now()
    }
  }
  MetaData.resources[id]
  await fs.mkdir(path.dirname(resPath), { recursive: true })
  if (file instanceof Buffer) {
    await fs.writeFile(resPath, file)
  }
  if (typeof file === 'string') {
    await fs.writeFile(resPath, file, 'utf-8')
  }
  MetaData.resources = Object.fromEntries(
    Object.entries(MetaData.resources).sort((a, b) => a[0].localeCompare(b[0]))
  )
  await fs.writeFile(Meta, JSON.stringify(MetaData, null, 2), 'utf-8')
}
