import path from 'node:path'
const dirname = import.meta.dirname as string
const filename = import.meta.filename as string
import { SupportedLanguages, addToDist } from '../utils.ts'
import a from '../../Snap.Metadata/Genshin/CHS/Avatar/10000002.json' with { type: 'json' }

const dir = Deno.readDirSync(
  path.join(dirname, '../../Snap.Metadata/Genshin/CHS/Avatar/')
)

let fileList = []

for (const file of dir) {
  fileList.push(file.name)
}

for (const lang of SupportedLanguages) {
  const map: Record<string, any> = {}
  for (const file of fileList) {
    const text = Deno.readTextFileSync(
      path.join(
        dirname,
        '../../Snap.Metadata/Genshin/' + lang.name + '/Avatar/',
        file
      )
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
