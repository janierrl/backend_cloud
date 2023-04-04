const { Router } = require('express');
const { uploadFile, getFiles, downloadFile, getFileURL, deleteFile } = require('./s3.js');
const rimraf = require('rimraf');
const router = Router();

router.get('/files/:fileName', async (req, res) => {
    const stream = await getFiles();

    stream.on('data', function(obj) { 
        if (obj.name === req.params.fileName) {
            res.json({ files: obj });
        }
    });
    
    console.log('file found')
})

router.get('/downloadfile/:fileName', async (req, res) => {
    await downloadFile(req.params.fileName);
    
    res.json({ message: 'file download' });
    console.log('file download')
})

router.get('/files', async (req, res) => {
    const data = [];
    const stream = await getFiles();

    stream.on('data', function(obj) { data.push(obj); });
    stream.on('end', function(obj) { res.json({ files: data }); });
    console.log('files listed')
})

router.get('/fileUrl/:fileName', async (req, res) => {
    const url = await getFileURL(req.params.fileName);
    
    res.json({ message: url });
    console.log('url download')
})

router.post('/files', async (req, res) => {
    await uploadFile(req.files['video']);
    rimraf.sync('./uploads');

    res.json({ message: 'upload file' });
    console.log('upload file')
})

router.post('/test', async (req, res) => {
    req.files['video'].mimetype = 'video/mp4';
    console.log(req.files['video']);
    res.send('upload file')
})

router.delete('/deleteFile/:fileName', async (req, res) => {
    await deleteFile(req.params.fileName);

    res.json({ message: 'deleted file' });
    console.log('deleted file')
})

module.exports = router;