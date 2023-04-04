require('dotenv').config();

const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
const ENDPOINT = process.env.ENDPOINT;

module.exports = {
    MINIO_BUCKET_NAME,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    ENDPOINT
}