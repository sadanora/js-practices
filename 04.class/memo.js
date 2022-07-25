// モジュール読み込み
const fs = require('fs')
const enquirer = require('enquirer')
const minimist = require('minimist')
const readline = require('readline')

// 定数を宣言
const DIRECTORY_PATH = './memos'
const ERR_MESSAGE = {
  withoutMemo: 'Memo was not found'
}
Object.freeze(ERR_MESSAGE)

// クラスを定義
class Memo {
  constructor (title, body) {
    this.title = title
    this.body = body
  }

  save (filePath) {
    fs.writeFileSync(filePath, this.body)
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
      const filePath = this.#generateFilePath(title)
      const memo = new Memo(title, body)
      memo.save(filePath)
    })
  }

  list () {
    const titles = this.#getTitles()
    if (this.#isBlankArray(titles)) {
      titles.push(ERR_MESSAGE.withoutMemo)
    }
    return titles
  }

  async refer () {
    const choices = this.#getTitles()
    const lines = []

    if (this.#isBlankArray(choices)) {
      lines.push(ERR_MESSAGE.withoutMemo)
      return lines
    } else {
      const message = 'Choose a memo you want to see:'
      const question = this.#generateQuestion(message, choices)
      const answer = await enquirer.prompt(question)

      const filePath = this.#generateFilePath(answer.chooseMemo)
      const stream = fs.createReadStream(filePath, 'utf8')
      const reader = readline.createInterface({
        input: stream
      })
      return new Promise((resolve) => {
        reader.on('line', (line) => {
          lines.push(line)
        })
        reader.on('close', () => {
          resolve(lines)
        })
      })
    }
  }

  async delete () {
    const choices = this.#getTitles()

    if (this.#isBlankArray(choices)) {
      return ERR_MESSAGE.withoutMemo
    } else {
      const message = 'Choose a memo you want to delete:'
      const question = this.#generateQuestion(message, choices)
      const answer = await enquirer.prompt(question)
      const filePath = this.#generateFilePath(answer.chooseMemo)

      return new Promise((resolve) => {
        fs.unlinkSync(filePath)
        resolve(`${answer.chooseMemo} has been deleted`)
      })
    }
  }

  #getTitles () {
    const files = fs.readdirSync(`${DIRECTORY_PATH}`)
    const titles = files.map(file => file.replace(/\.txt$/, ''))
    return titles
  }

  #generateQuestion (message, choices) {
    const question = {
      type: 'select',
      name: 'chooseMemo',
      message,
      choices
    }
    return question
  }

  #generateFilePath (fileName) {
    const filePath = `${DIRECTORY_PATH}/${fileName}.txt`
    return filePath
  }

  #isBlankArray (array) {
    return array.length === 0
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
const main = (argv) => {
  // ディレクトリが存在しなければ作成
  if (!fs.existsSync(DIRECTORY_PATH)) {
    fs.mkdirSync(DIRECTORY_PATH)
  }
  const command = new Command()
  if (argv.l) {
    command.list().forEach(titles => {
      console.log(titles)
    })
  } else if (argv.r) {
    command.refer().then(lines => {
      lines.forEach(line => {
        console.log(line)
      })
    })
  } else if (argv.d) {
    command.delete().then(result => {
      console.log(result)
    })
  } else {
    command.create()
  }
}

main(argv)
