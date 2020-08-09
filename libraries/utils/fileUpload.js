const Minio = require('minio');
const config = require('config');
const fs = require('fs');
const sharp = require('sharp');

const dir = './tmp';
const Path = require('path');
const Util = require('util');

const ReadFile = Util.promisify(fs.readFile);

/**
* Get all item
* @param {Object} req express request object
* @param {Object} res express response object
* @api public
*/
const uploadMinioImage = async (file, minioSizePath) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  await file.mv(`tmp/${file.md5}`);
  let appUrl = config.get('minio.avaendpoint');
  appUrl = appUrl.replace('http://', '');
  appUrl = appUrl.replace('https://', '');
  // change name image
  const extension = file.name.substr(file.name.lastIndexOf('.') + 0);
  file.name = `avatar_${new Date().getTime().toString()}${extension}`;

  // setting minio
  const minioClient = new Minio.Client({
    endPoint: appUrl,
    useSSL: false,
    // port: parseInt(config.get('minio.port')),
    accessKey: config.get('minio.accesskey'),
    secretKey: config.get('minio.secretkey'),
  });
    // minio upload
  const itemBucket = await minioClient.bucketExists(config.get('minio.avabucket'));
  if (!itemBucket) {
    await minioClient.makeBucket(config.get('minio.avabucket'));
  }
  // resize for small image
  await sharp(file.data).resize(minioSizePath.small.height, minioSizePath.small.width).toFile(`tmp/${file.md5}small`);
  await minioClient.fPutObject(config.get('minio.avabucket'), `${minioSizePath.small.path}/${file.name}`, `tmp/${file.md5}small`);
  fs.unlinkSync(`tmp/${file.md5}small`);
  // resize for medium image
  await sharp(file.data).resize(minioSizePath.medium.height, minioSizePath.medium.width).toFile(`tmp/${file.md5}medium`);
  await minioClient.fPutObject(config.get('minio.avabucket'), `${minioSizePath.medium.path}/${file.name}`, `tmp/${file.md5}medium`);
  fs.unlinkSync(`tmp/${file.md5}medium`);
  await minioClient.fPutObject(config.get('minio.avabucket'), `${minioSizePath.normal.path}/${file.name}`, `tmp/${file.md5}`);

  const uploaded = {
    extension: file.name.substr(file.name.lastIndexOf('.') + 1),
    url: {
      small: `${config.get('minio.avaendpoint')}/${config.get('minio.avabucket')}/${minioSizePath.small.path}/${file.name}`,
      medium: `${config.get('minio.avaendpoint')}/${config.get('minio.avabucket')}/${minioSizePath.medium.path}/${file.name}`,
      normal: `${config.get('minio.avaendpoint')}/${config.get('minio.avabucket')}/${minioSizePath.normal.path}/${file.name}`,
    },
    filename: file.name,
  };
  return uploaded;
};

/**
* Get all item
* @param {Object} req express request object
* @param {Object} res express response object
* @api public
*/
const upload = async (files) => {
  if (Object.keys(files).length == 0) {
    throw new Error('No file uploaded!');
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // save file temporarily
  const extension = files.file.name.substr(files.file.name.lastIndexOf('.') + 1);
  const fullPath = `tmp/${files.file.md5}.${extension}`;
  await files.file.mv(fullPath);

  const uploaded = {
    fullPath,
    name: files.file.name,
  };

  return uploaded;
};

/**
* Get all item
* @param {Object} req express request object
* @param {Object} res express response object
* @api public
*/
const deleteFile = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  } else {
    return false;
  }

  return true;
};

/**
* Get all item
* @param {Object} req express request object
* @param {Object} res express response object
* @api public
*/
const readFile = async (path) => {
  try {
    const templatePath = Path.resolve(__dirname, path);
    const content = await ReadFile(templatePath);
    return content;
  } catch (e) {
    return false;
  }
};

module.exports = {
  upload,
  deleteFile,
  readFile,
  uploadMinioImage,
};
