import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import formatDate from './utils/dateFormatting';



interface CustomRequest extends Request {
    file?: Express.Multer.File;
}

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {

        const fileExtensionRegex = /\.[0-9a-z]+$/i;
        const baseName = file.originalname.replace(fileExtensionRegex, '');
        const newFilename = `${baseName} - ${formatDate(new Date())}`;



        cb(null,  newFilename) 
    }
});

const upload = multer({ storage: storage });

app.post('/convert', upload.single('file'), async (req: CustomRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = req.file.path;
    // Conversion logic here
    res.send(`File uploaded and stored at ${filePath}`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
