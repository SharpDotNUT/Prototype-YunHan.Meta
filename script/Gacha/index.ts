import fs from 'node:fs'
import path from 'node:path'
import { SupportedLanguages, addToDist } from '../utils.ts'
const dirname = import.meta.dirname as string

console.log(`Gacha - 开始`)
const data: any = {}
const textMap: any = {}
for (const lang of SupportedLanguages.slice(1)) {
  let rawData = JSON.parse(
    fs.readFileSync(
      path.join(
        dirname,
        '../../Snap.Metadata/Genshin/' + lang.name + '/GachaEvent.json'
      ),
      'utf-8'
    )
  )
  for (let item of rawData) {
    const itemData = {
      name: `T-${item.Version}-${item.Order}-${item.Type}`,
      order: item.Order,
      type: item.Type,
      star5: item.UpOrangeList,
      star4: item.UpPurpleList,
      from: item.From,
      to: item.To,
      img: `I-${item.Version}-${item.Order}-${item.Type}`
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
}
addToDist('gacha/pool/meta', 'json', undefined, JSON.stringify(data, null, 2))
for (const lang of SupportedLanguages) {
  textMap[lang.lang] = {}
  let rawData = JSON.parse(
    fs.readFileSync(
      path.join(
        dirname,
        '../../Snap.Metadata/Genshin/' + lang.name + '/GachaEvent.json'
      ),
      'utf-8'
    )
  )
  for (let item of rawData) {
    textMap[lang.lang][`T-${item.Version}-${item.Order}-${item.Type}`] =
      item.Name
    textMap[lang.lang][`I-${item.Version}-${item.Order}-${item.Type}`] =
      item.Banner
  }
  addToDist(
    'gacha/pool/text-map',
    'json',
    lang.lang,
    JSON.stringify(textMap[lang.lang], null, 2)
  )
}
