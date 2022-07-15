const fs = require('fs');
const dayjs = require('dayjs')

// ディレクトリが存在しなければ作成
const directoryPath = './memos'
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}

// 標準入力の受け取り
const memo = async () => {
  const buffers = [];
  for await (const chunk of process.stdin) buffers.push(chunk);
  const buffer = String.prototype.concat(buffers);
  const text = buffer.toString();
  return text;
};

// ファイルを作成して保存
memo().then(text => {
  const fileName = dayjs().toISOString()
  fs.writeFileSync(`./memos/${fileName}`, text);
});
