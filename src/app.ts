import express, { Request, Response } from "express";
import multer from "multer";
import fs from 'fs'; // Import the file system module
import convertToPdf from "./convertToPdf";
import formatDate from "./dateFormatting";

interface CustomRequest extends Request {
  file?: Express.Multer.File;
}

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileExtensionRegex = /\.[0-9a-z]+$/i;
    const baseName = file.originalname.replace(fileExtensionRegex, "");
    const newFilename = `${baseName} - ${formatDate(new Date())}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

app.post('/convert', upload.single('file'), (req: CustomRequest, res: Response) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  const filePath = req.file.path;  // This is the path to the uploaded file

  convertToPdf(filePath, (err, convertedFilePath) => {
      if (err) {
          console.error('Error converting file:', err);
          return res.status(500).send('Error converting file');
      }
      if (!convertedFilePath) {
          console.error('Conversion did not return a file path.');
          return res.status(500).send('File conversion did not return a valid path.');
      }

      res.download(convertedFilePath, (downloadErr) => {
          if (downloadErr) {
              console.error('Error downloading file:', downloadErr);
              res.status(500).send('Error downloading file');
          } else {
              fs.unlinkSync(convertedFilePath); 
          }
      });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
