import fs from 'fs/promises'
import path from 'path'
const dirname = import.meta.dirname as string
const filename = import.meta.filename as string
import { SupportedLanguages, addToDist } from '../utils.ts'
import a from '../../Snap.Metadata/Genshin/CHS/Avatar/10000002.json' with { type: 'json' }

const dir = await fs.readdir(
  path.join(dirname, '../../Snap.Metadata/Genshin/CHS/Avatar/')
)

let fileList: string[] = []

for (const file of dir) {
  fileList.push(file)
}

const data: any = {}

for (const lang of SupportedLanguages) {
  const map: Record<string, string> = {}
  for (const file of fileList) {
    const text = await fs.readFile(
      path.join(
        dirname,
        '../../Snap.Metadata/Genshin/' + lang.name + '/Avatar/',
        file
      ),
      'utf-8'
    )
    const data = JSON.parse(text) as typeof a
    map[data.Id] = data.Name
  }
  data[lang.lang] = map
}

addToDist('id-text-map', 'json', undefined, JSON.stringify(data, null, 2))
