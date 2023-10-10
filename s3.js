const minio = require("minio");
const {
  ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME,
} = require("./config.js");

const client = new minio.Client({
  endPoint: ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

async function uploadFile(file, prefix) {
  await client.fPutObject(
    MINIO_BUCKET_NAME,
    `${prefix}/${file.name}`,
    file.tempFilePath
  );
}

async function getFiles() {
  return await client.listObjectsV2(MINIO_BUCKET_NAME);
}

async function getNameFiles(prefix) {
  return await client.listObjectsV2(MINIO_BUCKET_NAME, prefix, false);
}

async function downloadFile(prefix) {
  return client.listObjectsV2(MINIO_BUCKET_NAME, prefix, true);
}

async function readFiles(prefix) {
  return client.getObject(MINIO_BUCKET_NAME, prefix);
}

async function checkFileExists(file, prefix) {
  try {
    return await client.statObject(MINIO_BUCKET_NAME, `${prefix}/${file.name}`);
  } catch (error) {
    if (error.code === "NotFound") {
      return null;
    }
    throw error;
  }
}

async function getFileURL(prefix) {
  return await client.presignedUrl("GET", MINIO_BUCKET_NAME, prefix, 3600);
}

async function deleteFile(prefix) {
  const objects = await client.listObjectsV2(MINIO_BUCKET_NAME, prefix, true);
  const objectsToDelete = [];

  objects.on("data", (obj) => {
    objectsToDelete.push(obj.name);
  });

  objects.on("end", async () => {
    client.removeObjects(MINIO_BUCKET_NAME, objectsToDelete);
  });
}

async function updateFile(prefix, content) {
  await client.putObject(
    MINIO_BUCKET_NAME,
    prefix,
    content,
    "application/json"
  );
}

async function moveFile(oldPrefix, newPrefix) {
  const objects = await client.listObjectsV2(
    MINIO_BUCKET_NAME,
    oldPrefix,
    true
  );
  const objectsToMove = [];

  objects.on("data", (obj) => {
    objectsToMove.push(obj);
  });

  objects.on("end", async () => {
    for (const obj of objectsToMove) {
      const oldObjectName = obj.name;
      const newObjectName = oldObjectName.replace(oldPrefix, newPrefix);
      var copyConditions = new minio.CopyConditions();

      copyConditions.setMatchETag(obj.etag);

      await client.copyObject(
        MINIO_BUCKET_NAME,
        newObjectName,
        `${MINIO_BUCKET_NAME}/${oldObjectName}`,
        copyConditions
      );
      await client.removeObject(MINIO_BUCKET_NAME, oldObjectName);
    }
  });
}

module.exports = {
  uploadFile,
  getFiles,
  getNameFiles,
  downloadFile,
  readFiles,
  checkFileExists,
  getFileURL,
  deleteFile,
  updateFile,
  moveFile,
};
