import fs from 'fs'

const main = () => {
    fs.readFile('instrukce.txt', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err.message);
        } else {
            let fileNames = data.split(" ");
            copyContentFile(fileNames[0], fileNames[1]);
        }
    });
}

const copyContentFile = (sourceFile, targetFile) => {
    fs.readFile(sourceFile, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading source file ${sourceFile}: ${err.message}.`);
        } else {
            fs.writeFile(targetFile, data, 'utf8', (err) => {
                if (err) {
                    console.error(`Error reading source file ${targetFile}: ${err.message}.`);
                } else {
                    console.log(`Data successfully copied from ${sourceFile} to ${targetFile}.`);
                }
            });
        }
    });
}

main();