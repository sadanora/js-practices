// dayjsモジュールのrequireとロケール設定
const dayjs = require('dayjs')
require('dayjs/locale/ja')
dayjs.locale('ja')

// コマンドライン引数の取得
const now = dayjs()
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    y: 'year',
    m: 'month'
  },
  default: {
    y: now.format('YYYY'),
    m: now.format('M')
  }
})

// 対象月のインスタンス作成
const targetMonth = dayjs(`${argv.y}-${argv.m}`)

// 日付の取得
const startDate = targetMonth.startOf('month')
const endDate = targetMonth.endOf('month')
const dates = []
for (let date = startDate; date <= endDate; date = date.add(1, 'd')) {
  dates.push(date)
}

// ヘッダーを表示
const PaddingRight = 20
let PaddingLeft = 0
targetMonth.format('MMMM YYYY').length === 8 ? PaddingLeft = 14 : PaddingLeft = 13

console.log(targetMonth.format('MMMM YYYY').padStart(PaddingLeft, ' ').padEnd(PaddingRight, ' '))
console.log(('日 月 火 水 木 金 土'))

// 1日までを空白で埋める
const blankUnit = 3
const wday = startDate.format('d')

process.stdout.write(`${' '.repeat(wday * blankUnit)}`)

// 日付の表示
const saturday = 6

for (const date of dates) {
  process.stdout.write(`${date.format('D').padStart(2, ' ')} `)
  if (parseInt(date.format('d')) === saturday) {
    process.stdout.write('\n')
  }
}
