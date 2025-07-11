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

for (const lang of SupportedLanguages) {
  const map: Record<string, any> = {}
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
    map[data.Id] = {
      birth: [data.FetterInfo.BirthMonth, data.FetterInfo.BirthDay],
      icon: data.Icon
    }
  }
  const avatarList = new Set()
  for (const character of Object.values(map)) {
    avatarList.add(character.icon)
    console.log(
      `https://homdgcat.wiki/homdgcat-res/Avatar/${character.icon}.png`
    )
  }
  addToDist('character/meta', 'json', undefined, JSON.stringify(map, null, 2))
}
