import path from 'node:path'

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

const dirname = import.meta.dirname
const Meta = path.join(dirname, '../dist/meta.json')
let MetaData = JSON.parse(await Deno.readTextFile(Meta))
if (!MetaData.data) {
  MetaData = {
    updateTime: new Date().toISOString(),
    data: {}
  }
}

Deno.mkdirSync(path.join(dirname, '../dist/res'), { recursive: true })

export function addJSONToDist(id, data) {
  addToDist(id, JSON.stringify(data))
}

export function addToDist(id, file, options = {}) {
  const defaultOptions = {
    type: 'json'
  }
  options = { ...defaultOptions, ...options }
  const filename = `/res/${id}.${options.type}`
  MetaData.data[id] = {
    file: filename,
    updateTime: new Date().toISOString()
  }
  MetaData.updateTime = new Date().toISOString()
  Deno.writeTextFile(
    path.join(dirname, `../dist/res/${id}.${options.type}`),
    file
  )
  Deno.writeTextFile(Meta, JSON.stringify(MetaData, null, 4))
}
