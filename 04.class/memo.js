// モジュール読み込み
const fs = require('fs')
const enquirer = require('enquirer')
const minimist = require('minimist')
const readline = require('readline')

// メモの保存先ディレクトリを宣言
const DIRECTORY_PATH = './memos'

class Memo {
  constructor (title, body) {
    this.title = title
    this.body = body
  }

  create () {
    fs.writeFileSync(`${DIRECTORY_PATH}/${this.title}.txt`, this.body)
  }
}

class Command {
  create () {
    const lines = []
    const reader = readline.createInterface(process.stdin)
    reader.on('line', (line) => {
      lines.push(line)
    })
    reader.on('close', () => {
      const title = String(lines[0])
      const body = lines.join('\n')
      const memo = new Memo(title, body)
      memo.create()
    })
  }

  async refer () {
    const message = 'Choose a memo you want to see:'
    const choices = this.list()
    const question = this.#question(message, choices)
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
    files.forEach(title => {
      list.push(title.split('.txt')[0])
    })
    return list
  }

  async delete () {
    const message = 'Choose a memo you want to delete:'
    const choices = this.list()
    const question = this.#question(message, choices)
    const answer = await enquirer.prompt(question)

    fs.unlinkSync(`${DIRECTORY_PATH}/${answer.chooseMemo}.txt`)
    console.log(`${answer.chooseMemo} has been deleted`)
  }

  #question (message, choices) {
    const question = {
      type: 'select',
      name: 'chooseMemo',
      message,
      choices
    }
    return question
  }
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

// メインロジック
const command = new Command()
const main = (argv) => {
  // ディレクトリが存在しなければ作成
  if (!fs.existsSync(DIRECTORY_PATH)) {
    fs.mkdirSync(DIRECTORY_PATH)
  }
  if (argv.r) {
    command.refer()
  } else if (argv.l) {
    command.list().forEach(memoTitle => {
      console.log(memoTitle)
    })
  } else if (argv.d) {
    command.delete()
  } else {
    command.create()
  }
};

main(argv)
