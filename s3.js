const minio = require('minio');
const { ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET_NAME } = require ('./config.js');

const client = new minio.Client({
    endPoint: ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY
});

async function uploadFile(file) {
    await client.fPutObject(MINIO_BUCKET_NAME, file.name, file.tempFilePath);
}

async function getFiles() {
    return await client.listObjectsV2(MINIO_BUCKET_NAME);
}

async function downloadFile(filename) {
    await client.fGetObject(MINIO_BUCKET_NAME, filename, `./docs/${filename}`);
}

async function getFileURL(filename) {
    return await client.presignedUrl('GET', MINIO_BUCKET_NAME, filename, 3600);
}

async function deleteFile(filename) {
    await client.removeObject(MINIO_BUCKET_NAME, filename);
}

module.exports = {
    uploadFile,
    getFiles,
    downloadFile,
    getFileURL,
    deleteFile
}