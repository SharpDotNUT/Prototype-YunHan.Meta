import { Buffer } from 'node:buffer'
import path from 'node:path'
import crypto from 'node:crypto'

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
  resources: Record<string, StaticResourceMetaRecord>
}

const dirname = import.meta.dirname as string
const Meta = path.join(dirname, '../data/meta.json')
let MetaData: StaticResourceMeta = JSON.parse(Deno.readTextFileSync(Meta))
MetaData.updatedAt = Date.now()

Deno.mkdirSync(path.join(dirname, '../data/res'), { recursive: true })

export function addToDist(
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
  Deno.mkdirSync(path.dirname(resPath), { recursive: true })
  if (file instanceof Buffer) {
    Deno.writeFileSync(resPath, file)
  }
  if (typeof file === 'string') {
    Deno.writeTextFile(resPath, file)
  }
  Deno.writeTextFile(Meta, JSON.stringify(MetaData, null, 2))
}
