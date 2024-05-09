import libre from "libreoffice-convert";
import fs from "fs";
import path from "path";

const extend = ".pdf";

const convertToPDF = (
  filePath: string,
  callback: (error: Error | null, outputPath?: string) => void
) => {
  const outputPath = path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath)) + extend
  );

  // Read the file into a Buffer
  fs.readFile(filePath, (readError, fileContent) => {
    if (readError) {
      console.error(`Error reading file: ${readError.message}`);
      return callback(readError);
    }

    // Convert the Buffer to a PDF
    libre.convert(
      fileContent,
      extend,
      undefined,
      (err: Error | null, done: Buffer) => {
        if (err) {
          console.error(`Conversion error: ${err.message}`);
          return callback(err);
        }

        // Write the resulting Buffer to a file
        fs.writeFile(outputPath, done, (writeError) => {
          if (writeError) {
            console.error(`Error writing file: ${writeError.message}`);
            return callback(writeError);
          }

          console.log("Conversion successful:", outputPath);
          callback(null, outputPath);
        });
      }
    );
  });
};

export default convertToPDF;
