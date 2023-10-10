const fs = require("fs");
const path = require("path");

function deleteDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      deleteDir(filePath);
    } else {
      fs.unlink(filePath, () => {
        console.log("File Deleted!");
      });
    }
  }

  fs.rmdir(dirPath, () => {
    console.log("Folder Deleted!");
  });
}

async function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

module.exports = {
  deleteDir,
  readJsonFile,
};
