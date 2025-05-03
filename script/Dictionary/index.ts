import { addToDist } from '../utils.ts'

const res = await fetch('https://dataset.genshin-dictionary.com/words.json')
const words = await res.text()

addToDist('dictionary/genshin', 'json', undefined, words)

console.log('Dictionary updated')
