const dayjs = require('dayjs')

require('dayjs/locale/ja')
dayjs.locale('ja')

const now = dayjs()

// 日付の取得
const startDate = now.startOf('month')
const endDate = now.endOf('month')
const dates = []

for (let date = startDate; date <= endDate; date = date.add(1, 'd')) {
  dates.push(date)
}

// ヘッダーを表示
let headerPadding = 0
now.format('MMMM YYYY').length === 8 ? headerPadding = 14 : headerPadding = 13
console.log(now.format('MMMM YYYY').padStart(headerPadding, ' ').padEnd(20, ' '))
console.log(('日 月 火 水 木 金 土'))

// 1日までを空白で埋める
const wday = now.format('d')
process.stdout.write(`${' '.repeat(wday * 3)}`)

// 日付の表示
for (const date of dates) {
  process.stdout.write(`${date.format('D').padStart(2, ' ')} `)
  if (parseInt(date.format('d')) === 6) {
    process.stdout.write('\n')
  }
}
