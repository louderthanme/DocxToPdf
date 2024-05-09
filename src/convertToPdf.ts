import {exec} from 'child_process';
import path from 'path';

type ConvertCallback = (error: Error | null, outputPath?: string) => void;

function convertToPDF(filePath: string, callback:ConvertCallback) {
    const outputPath = filePath.replace(/\.\w+$/, '.pdf');  // Change the file extension to .pdf
    const command = `libreoffice --headless --convert-to pdf --outdir ${path.dirname(filePath)} ${filePath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return callback(error);
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return callback(new Error(stderr));
        }
        console.log(`stdout: ${stdout}`);
        callback(null, outputPath);
    });
}

export default convertToPDF;