const Minio = require('minio');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT * 1,
  useSSL: process.env.MINIO_USE_SSL === 'false' ? false : true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

exports.uploadFiles = async (files) => {
  const isArray = Array.isArray(files);
  if (!isArray) {
    files = [files]; // Wrap single file in an array
  }

  const uploadedFilesInfo = [];

  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Helper function to upload a file
  const uploadFile = (uploadedFile) => {
    return new Promise((resolve, reject) => {
      const filename = uploadedFile.name;
      const fileData = uploadedFile.data;

      const tempFilePath = path.join(tempDir, filename);
      fs.writeFileSync(tempFilePath, fileData);

      const metaData = {
        'Content-Type':
          filename.slice(-3) === 'pdf'
            ? 'application/pdf'
            : 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        example: 5678,
      };

      const crypto_fileName =
        crypto.randomUUID({ disableEntropyCache: true }) + '-' + filename;
      const bucket = process.env.MINIO_BUCKET_NAME;
      minioClient.fPutObject(
        bucket,
        crypto_fileName,
        tempFilePath,
        metaData,
        function (err, etag) {
          if (err) {
            console.log('Error uploading file:', err);
            reject(err);
          } else {
            console.log('File uploaded successfully.');
            uploadedFilesInfo.push({
              name: filename,
              path: `${bucket}/${crypto_fileName}`,
            });

            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
            resolve();
          }
        }
      );
    });
  };

  // Upload all files in parallel
  await Promise.all(files.map(uploadFile));
  if (!isArray) {
    return uploadedFilesInfo[0];
  }
  return uploadedFilesInfo;
};
