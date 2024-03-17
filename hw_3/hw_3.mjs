import fs from 'fs/promises'

const createFiles = async (sourceFile) => {
    try {
        const countFiles = parseInt(await fs.readFile(sourceFile, 'utf-8'));
        const fileCreationPromises = [];

        for (let i = 0; i < countFiles; i++) {
            const filePromise = fs.writeFile(`${i}.txt`, `Soubor ${i}`);
            fileCreationPromises.push(filePromise);
        }
        await Promise.all(fileCreationPromises);

        console.log('Všechny soubory byly úspěšně vytvořeny.');
    } catch (err) {
        console.error(`Nastala chyba: ${err.message}`);
    }
}

createFiles('instrukce.txt');