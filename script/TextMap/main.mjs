import fs from 'node:fs'
import path from 'node:path'

const __dirname = import.meta.dirname

import { Languages } from '../utils.mjs'

export async function main() {
  for (const lang of Languages) {
    const url = `https://github.com/DimbreathBot/AnimeGameData/raw/refs/heads/master/TextMap/TextMap${lang}.json`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        fs.writeFileSync(
          path.join(__dirname, `../TextMap${lang}.json`),
          JSON.stringify(data, null, 4)
        )
        console.log(`TextMap${lang}.json downloaded`)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

main()
