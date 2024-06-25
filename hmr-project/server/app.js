import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';


import { clientSideRootDir } from './consts.js'
export const app = express();


import { promises as fs } from 'fs';

async function injectHmrClientScript(htmlPath, res) {
    const htmlFile = await fs.readFile(htmlPath, 'utf8');
    const hmrScriptTag = '<!-- Injected script from module bundler -->\n<script src="/clientHmr.js"></script>';
    const updatedHtml = htmlFile.replace('</head>', `\n${hmrScriptTag}\n</head>`);
    res.send(updatedHtml);
}

// Inject clientHmr script for any requested html file
app.use((req, res, next) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
        // Determine the requested HTML file
        const requestedPath = req.path === '/' ? 'index.html' : req.path;
        const htmlPath = path.join(clientSideRootDir, requestedPath);
        injectHmrClientScript(htmlPath, res);
    } else {
        next();
    }
});

// Serve static files from the developer directory.
app.use('/', express.static(clientSideRootDir));

// Serve clientHmr.js file - which is from my server
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.get('/clientHmr.js', (_, res) => {
    res.sendFile(path.join(dirname, './clientHmr.js'));
});
