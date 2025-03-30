import fs from 'node:fs'
import path from 'node:path'
const __dirname = import.meta.dirname
import { SupportedLanguages } from '../utils.mjs'

console.log('Maps - 开始')
for (const lang of SupportedLanguages) {
  const Avatars = fs.readdirSync(
    path.join(__dirname, '../../Snap.Metadata-main/Genshin/' + lang + '/Avatar')
  )
  const Weapon = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '../../Snap.Metadata-main/Genshin/' + lang + '/Weapon.json'
      ),
      'utf-8'
    )
  )
  const res = {}
  for (const i of Avatars) {
    let id = i.split('.')[0]
    let name = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          '../../Snap.Metadata-main/Genshin/' + lang + '/Avatar/' + i
        ),
        'utf-8'
      )
    ).Name
    res[id] = name
  }
  for (const i in Weapon) {
    res[Weapon[i].Id] = Weapon[i].Name
  }
  fs.mkdirSync(path.join(__dirname, '../../dist/maps/'), { recursive: true })
  fs.writeFileSync(
    path.join(__dirname, '../../dist/maps/' + lang + '.json'),
    JSON.stringify(res, null, 2)
  )
  addInSourceMap('map', lang)
  console.log(`Maps - '${lang}'已完成`)
}
console.log(`Maps - 全部已完成`)
