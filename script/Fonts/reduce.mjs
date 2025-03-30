import fs from 'fs'
import path from 'path'
const __dirname = import.meta.dirname
const __filename = import.meta.filename

const data = fs.readFileSync(path.join(__dirname, './data.json'), 'utf-8')

let css = ``

for (const item of JSON.parse(data)) {
  css += `
    @font-face {
        font-family: '${item.id}';
        src: url('${item.file}');
    }
    .font-${item.id} {
        font-family: '${item.id}';
    }
    `
}

fs.writeFileSync(path.join(__dirname, './fonts.css'), css, 'utf-8')
