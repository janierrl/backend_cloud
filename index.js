const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const routes = require('./routes.js');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(routes);

app.listen(3002,() =>{
    console.log(`Server on port ${3002}`);
});