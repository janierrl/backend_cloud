const { Router } = require('express');
const fs = require('fs');
const { uploadFile, getFiles, downloadFile, getFileURL, deleteFile } = require('./s3.js');
const { deleteDir, readJsonFile } = require('./utils.js');
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
    try {
        const screenJsonData = await readJsonFile(req.files['json_screen'].tempFilePath);
        const consultancyJsonData = await readJsonFile(req.files['json_consultancy'].tempFilePath);
        const screenName = screenJsonData.nameScreen;
        const consultancyName = consultancyJsonData.nameConsultancy;
        const folderPathScreen = `Consultorías TI/${consultancyName}/Observaciones/${screenName}`;
        const folderPathConsultancy = `Consultorías TI/${consultancyName}`;

        await uploadFile(req.files['json_screen'], folderPathScreen);
        await uploadFile(req.files['video'], folderPathScreen);
        await uploadFile(req.files['json_consultancy'], folderPathConsultancy);
        deleteDir('./uploads');
        //rimraf.sync('./uploads');

        res.json({ message: 'upload file' });
        console.log('upload file');
    } catch (error) {
        console.error('Error al procesar archivos JSON:', error);
        return res.status(500).json({ error: 'Error al procesar archivos JSON' });
    }
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