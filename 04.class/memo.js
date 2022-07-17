const fs = require('fs')
const enquirer = require('enquirer')
const minimist = require('minimist')
const readline = require('readline')

const DIRECTORY_PATH = './memos'

// ディレクトリが存在しなければ作成
if (!fs.existsSync(DIRECTORY_PATH)) {
  fs.mkdirSync(DIRECTORY_PATH)
}

// オプションの受け取り
const argv = minimist(process.argv.slice(2), {
  alias: {
    l: 'list',
    r: 'refer',
    d: 'delete'
  },
  default: {
    l: false,
    r: false,
    d: false
  }
})

class Memo {
  // constructor() {
  // }
  create () {
    const lines = []
    const reader = readline.createInterface(process.stdin)
    reader.on('line', (line) => {
      lines.push(line)
    })
    reader.on('close', () => {
      const fileName = String(lines[0])
      const text = lines.join('\n')
      fs.writeFileSync(`${DIRECTORY_PATH}/${fileName}.txt`, text)
    })
  }

  async refer () {
    const question = {
      type: 'select',
      name: 'chooseMemo',
      message: 'Choose a memo you want to see:',
      choices: this.list()
    }
    const answer = await enquirer.prompt(question)

    const stream = fs.createReadStream(`${DIRECTORY_PATH}/${answer.chooseMemo}.txt`, 'utf8')
    const rl = readline.createInterface({
      input: stream
    })

    rl.on('line', (lineString) => {
      console.log(lineString)
    })
  }

  list () {
    const files = fs.readdirSync(`${DIRECTORY_PATH}`)
    const list = []
    files.forEach(filename => {
      list.push(filename.split('.txt')[0])
    })
    return list
  }

  async delete () {
    const question = {
      type: 'select',
      name: 'chooseMemo',
      message: 'Choose a memo you want to delete:',
      choices: this.list()
    }

    const answer = await enquirer.prompt(question)

    fs.unlinkSync(`${DIRECTORY_PATH}/${answer.chooseMemo}.txt`)
    console.log('It has been deleted')
  }
}

// メインロジック
const memo = new Memo()

function main (argv) {
  if (argv.r) {
    memo.refer()
  } else if (argv.l) {
    memo.list().forEach(memoTitle => {
      console.log(memoTitle)
    })
  } else if (argv.d) {
    memo.delete()
  } else {
    memo.create()
  }
};

main(argv)
