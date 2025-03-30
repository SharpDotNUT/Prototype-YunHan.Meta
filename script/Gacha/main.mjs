import fs from 'fs'
import path from 'path'
import { SupportLanguages, addInSourceMap } from '../utils.mjs'
const __dirname = import.meta.dirname

console.log(`Gacha - 开始`)
for (const lang of SupportLanguages) {
  let rawData = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '../../Snap.Metadata-main/Genshin/' + lang + '/GachaEvent.json'
      )
    )
  )
  let data = {}
  for (let item of rawData) {
    const itemData = {
      name: item.Name,
      order: item.Order,
      type: item.Type,
      star5: item.UpOrangeList,
      star4: item.UpPurpleList,
      from: item.From,
      to: item.To,
      img: item.Banner
    }
    if (data[item.Version]) {
      if (data[item.Version][item.Order]) {
        data[item.Version][item.Order].push(itemData)
      } else {
        data[item.Version][item.Order] = [itemData]
      }
    } else {
      data[item.Version] = {
        1: [itemData]
      }
    }
  }

  fs.mkdirSync(path.join(__dirname, '../../dist/gacha'), { recursive: true })
  fs.writeFileSync(
    path.join(__dirname, '../../dist/gacha/' + lang + '.json'),
    JSON.stringify(
      {
        update: new Date().getTime(),
        data
      },
      null,
      2
    )
  )
  addInSourceMap('gacha', lang)
  console.log(`Gacha - ${lang}'完成`)
}
console.log(`Gacha - 全部完成`)
