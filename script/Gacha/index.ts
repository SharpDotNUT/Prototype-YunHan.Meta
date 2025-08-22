import fs from 'node:fs';
import path from 'node:path';
import { ResDir, SupportedLanguages, writeRes } from '../utils.ts';
import { mkdir } from 'node:fs/promises';

await mkdir(path.join(ResDir, 'gacha'), { recursive: true });

const baseLang = SupportedLanguages[0];
const baseData = JSON.parse(
  fs.readFileSync(
    path.join(
      import.meta.dirname,
      `../../source/Snap.MetaData/${baseLang.name}/GachaEvent.json`
    ),
    'utf-8'
  )
);

const poolData = {};
const poolStruct = {};
for (const item of baseData) {
  const key = `${item.Version}-${item.Order}-${item.Type}`;
  const pool = {
    name: `T-${key}`,
    img: `I-${key}`,
    order: item.Order,
    type: item.Type,
    star5: item.UpOrangeList,
    star4: item.UpPurpleList,
    from: item.From,
    to: item.To
  };

  poolData[key] = pool;
  poolStruct[item.Version] ??= {};
  poolStruct[item.Version][item.Order] ??= [];
  poolStruct[item.Version][item.Order].push(key);
}
await writeRes('gacha/pool', { poolData, poolStruct }, true);

for (const lang of SupportedLanguages) {
  const textMap = {};
  const langData = JSON.parse(
    fs.readFileSync(
      path.join(
        import.meta.dirname,
        `../../source/Snap.MetaData/${lang.name}/GachaEvent.json`
      ),
      'utf-8'
    )
  );

  for (const item of langData) {
    const key = `${item.Version}-${item.Order}-${item.Type}`;
    textMap[`T-${key}`] = item.Name;
    textMap[`I-${key}`] = item.Banner;
  }
  await writeRes(`gacha/text_map_${lang.lang}`, textMap);
}
