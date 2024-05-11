import express, { Request, Response } from "express";
import multer from "multer";
import fs from 'fs'; // Import the file system module
import convertToPdf from "./convertToPdf";
import formatDate from "./dateFormatting";
import cors from "cors";

interface CustomRequest extends Request {
  file?: Express.Multer.File;
}

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    fs.exists(uploadDir, (exists) => {
      if (!exists) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    });
  },
  filename: function (req, file, cb) {
    const fileExtensionRegex = /\.[0-9a-z]+$/i;
    const baseName = file.originalname.replace(fileExtensionRegex, "");
    const newFilename = `${baseName} - ${formatDate(new Date())}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

app.use(cors({
  origin: 'http://localhost:5173'  // This should match your app's URL
}));

app.post('/convert', upload.single('file'), (req: CustomRequest, res: Response) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  const filePath = req.file.path;
  console.log('File path:', filePath); // Debug log

  convertToPdf(filePath, (err, convertedFilePath) => {
      if (err) {
          console.error('Error converting file:', err);
          return res.status(500).send('Error converting file');
      }
      if (!convertedFilePath) {
          console.error('Conversion did not return a file path.');
          return res.status(500).send('File conversion did not return a valid path.');
      }

      console.log('Converted file path:', convertedFilePath); // Debug log

      res.download(convertedFilePath, (downloadErr) => {
          if (downloadErr) {
              console.error('Error downloading file:', downloadErr);
              res.status(500).send('Error downloading file');
          } else {
              fs.unlinkSync(convertedFilePath); // Ensure to delete the file after sending it
          }
      });
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
