import fs from 'node:fs'
import path from 'node:path'
const __dirname = import.meta.dirname
import { SupportLanguages } from './utils.mjs'

let data = []
s
for (const lang of SupportLanguages) {
  const charactersFiles = fs.readdirSync(
    path.join(__dirname, '../Snap.Metadata-main/Genshin/' + lang + '/Avatar/'),
    'utf8'
  )
  fs.cpSync(
    path.join(__dirname, '../Snap.Metadata-main/Genshin/' + lang + '/Avatar/'),
    path.join(__dirname, '../dist/data/characters/' + lang),
    { recursive: true }
  )
  charactersFiles.map((filename) => {
    const file = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          '../Snap.Metadata-main/Genshin/' + lang + '/Avatar/' + filename
        ),
        'utf8'
      )
    )
    if (lang == 'CHS') {
      data.push({
        id: file.Id,
        name: file.Name,
        body: file.Body,
        weapon: file.Weapon,
        rank: file.Quality,
        icon: file.Icon,
        element: file.FetterInfo.VisionBefore
      })
    } else {
      data.find((item) => item.id == file.Id)['name_' + lang] = file.Name
    }
  })
}
console.log(data)
fs.writeFileSync(
  path.join(__dirname, '../dist/data/characters/meta.json'),
  JSON.stringify(data),
  'utf8'
)
