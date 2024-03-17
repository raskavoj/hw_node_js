import http from 'http'
import fs from 'fs/promises'

const counterFileName = 'counter.txt';
const contentType = { 'Content-Type': 'text/plain' };
const port = 3000;

// Check if counter file exists
const ensureCounterFile = async () => {
    try {
        await fs.access(counterFileName);
    } catch (err) {
        await fs.writeFile(counterFileName, '0');
    }
}

// Get content of counter file
const getCounter = async () => {
    await ensureCounterFile();
    const counter = parseInt(await fs.readFile(counterFileName, 'utf-8'));
    return counter;
}

// Set content of counter file
const modifyCounter = async (operation) => {
    let counter = await getCounter();
    if (operation === 'increase') {
        counter++;
    } else if (operation === 'decrease') {
        counter--;
    }
    await fs.writeFile(counterFileName, counter.toString());
    return counter;
}

// Server
const server = http.createServer(async (req, res) => {
    const operation = req.url.slice(1);

    if (operation === 'increase' || operation === 'decrease') {
        try {
            await modifyCounter(operation);
            res.writeHead(200, contentType);
            res.end('OK');
        } catch (err) {
            console.error(`Nastala chyba: ${err}`);
            res.writeHead(500, contentType);
            res.end('Internal Server Error');
        }
    } else if (operation === 'read') {
        const counter = await getCounter();
        res.writeHead(200, contentType);
        res.end(counter.toString());
    } else {
        res.writeHead(404, contentType);
        res.end('404 Not Found');
    }
});


server.listen(port, () => {
    console.log(`Server běží na adrese http://localhost:${port}/`);
});
