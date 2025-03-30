import fs from 'node:fs'
import path from 'node:path'

const __dirname = import.meta.dirname

const Data = []

// Part 1
fs.readdirSync(
  path.join(__dirname, '../../Snap.Metadata-main/Genshin/CHS/Avatar/')
).forEach((filename) => {
  const file = fs.readFileSync(
    path.join(
      __dirname,
      '../../Snap.Metadata-main/Genshin/CHS/Avatar/',
      filename
    )
  )
  const data = JSON.parse(file)
  Data.push({
    name: data.Name,
    id: data.Id,
    Description: data.Description,
    FetterInfo: data.FetterInfo
  })
})

console.log(Data)
