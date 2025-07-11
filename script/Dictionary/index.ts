import { addToDist } from '../utils.ts'
import fs from 'fs/promises'
import path from 'path'
import { convertGIFormat } from './convert.ts'
const dirname = import.meta.dirname
const filename = import.meta.filename

let data: any = {}

if (process.argv[2] === 'fetch') {
  const res = await fetch('https://dataset.genshin-dictionary.com/words.json')
  const json = await res.json()
  data = json
  await fs.writeFile(
    path.join(dirname, 'genshin.temp.json'),
    JSON.stringify(json, null, 2),
    'utf-8'
  )
} else {
  data = JSON.parse(
    await fs.readFile(path.join(dirname, './genshin.temp.json'), 'utf-8')
  )
}

data = convertGIFormat(data)

const tags = JSON.parse(
  await fs.readFile(path.join(dirname, './tags.json'), 'utf-8')
)

addToDist(
  'dictionary/genshin',
  'json',
  undefined,
  JSON.stringify(data, null, 2)
)
addToDist(
  'dictionary/genshin-tags',
  'json',
  undefined,
  JSON.stringify(tags, null, 2)
)

console.log('Dictionary updated')
