// モジュール読み込み
const minimist = require('minimist')
const dayjs = require('dayjs')
require('dayjs/locale/ja')

// ロケール設定
dayjs.locale('ja')

// コマンドライン引数の取得
const now = dayjs()
const argv = minimist(process.argv.slice(2), {
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

// ヘッダーを表示
const paddingLeft = targetMonth.format('MMMM YYYY').length === 8 ? 14 : 13
const paddingRight = 20

console.log(targetMonth.format('MMMM YYYY').padStart(paddingLeft, ' ').padEnd(paddingRight, ' '))
console.log(('日 月 火 水 木 金 土'))

// 1日までを空白で埋める
const blankUnit = 3
const wday = startDate.day()

process.stdout.write(' '.repeat(wday * blankUnit))

// 日付の表示
const saturday = 6

for (let date = startDate; date <= endDate; date = date.add(1, 'd')) {
  process.stdout.write(`${date.format('D').padStart(2, ' ')} `)
  if (date.day() === saturday) {
    process.stdout.write('\n')
  }
}
