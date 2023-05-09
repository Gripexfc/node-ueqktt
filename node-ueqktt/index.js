const fs = require('fs');
const path = require('path');

// 定义处理文件夹结构的函数
function processDirectory(dirPath) {
  const result = {};

  // 读取目录中的文件和子文件夹
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // 如果是子文件夹，则递归处理子文件夹
      result[entry.name] = processDirectory(entryPath);
    } else if (entry.isFile() && entry.name === 'index.js') {
      // 如果是文件且文件名为 index.js，则处理文件内容
      const fileContent = fs.readFileSync(entryPath, 'utf8');
      const regex = /{[^{}]+}/g; // 使用正则匹配 {} 内容

      const matches = fileContent.match(regex);
      if (matches) {
        const mergedObject = matches.reduce((acc, match) => {
          const data = eval(`(${match})`); // 将匹配到的内容转为对象
            console.log(data,'data');
          return { ...acc, ...{[data.en]: data.zh} };
        }, {});

        Object.assign(result, mergedObject);
      }
    }
  }

  return result;
}

// 处理文件夹
const data = processDirectory('my-data');

// 输出处理后的数据
console.log(JSON.stringify(data, null, 2));
