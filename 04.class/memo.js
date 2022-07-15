const fs = require('fs')
const enquirer = require('enquirer');
const minimist = require('minimist');

// ディレクトリが存在しなければ作成
const directoryPath = './memos'
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}

// 標準入力の受け取り
const parseStdin = async () => {
  const buffers = []
  for await (const chunk of process.stdin) buffers.push(chunk);
  const text = String.prototype.concat(buffers);
  return text
};

// メモの追加
const createMemo = () => {
  parseStdin().then(text => {
    const fileName = text.split('\n')[0]
    fs.writeFileSync(`./memos/${fileName}.txt`, text);
  });
};

createMemo()
