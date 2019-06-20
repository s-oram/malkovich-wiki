#!/usr/bin/env node

import commander from 'commander';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import cors from 'cors';

import path from 'path';
import { isServerRunning, openBrowser } from './app-utils';

const program = new commander.Command();
program.version('0.0.1');
program.option('-p, --path <path>', 'location of notes directory');
program.option('-d, --doc <document>', 'name of document to open');
program.parse(process.argv);

const port = 4001;
const serverUrl = `http://localhost:${port}`;

const docPath = (() => {
    switch (true) {
        case program.path && path.isAbsolute(program.path):
            return program.path;

        case program.path && !path.isAbsolute(program.path):
            return path.resolve(path.join(process.cwd(), program.path));

        default:
            return process.cwd();
    }
})();

const docName = program.doc;



// console.log(`Directory: ${__dirname}`);
console.log(`DocPath: ${docPath}`);


async function startApp() {
    if (await isServerRunning(serverUrl)) {
        console.log('Server is running!');
        // openBrowser(serverUrl, docName);

    } else {
        const app = express();

        // Enable cors for all routes. It's possible to only enable cors for selected
        // routes with alternative configuration.
        // See: https://expressjs.com/en/resources/middleware/cors.html
        app.use(cors());

        // https://stackoverflow.com/a/25904070/395461
        app.use(bodyParser.urlencoded({
            extended: true,
        }));
        app.use(bodyParser.json());

        app.get('/ping', (req, res) => {
            res.send('pong');
        });

        app.get('/api/notes/:id', async (req, res) => {
            const filepathA = path.join(docPath, req.params.id, `index.md`);
            const filepathB = path.join(docPath, req.params.id, `meta.json`);
            try {
                // TODO:MED Replace the sync functions here with asyncronhous ones.
                const docText = fs.existsSync(filepathA)
                    ? await fs.readFile(filepathA, 'utf8')
                    : null;
                const docMeta = fs.existsSync(filepathB)
                    ? await fs.readJSON(filepathB)
                    : null;
                if (docText !== null) {
                    res.json({
                        meta: docMeta,
                        text: docText,
                    });
                } else {
                    res.status(204).send();
                }
            } catch (error) {
                console.log(error);
                res.json({ error: error.name});
                res.status(500).send();
            }
        });

        app.put('/api/notes/:id', async (req, res) => {
            const filepathA = path.join(docPath, req.params.id, `index.md`);
            try {
                // TODO:MED We need to validate the json schema here.
                const text = req.body.text;
                await fs.writeFile(filepathA, text);
                res.status(200).json({ status: 'hello world'});
            } catch (error) {
                console.log(error);
                res.json({ error: error.name });
                res.status(500);
            }
        });

        app.get('/', (req, res) => {
            res.status(204).send();
        });

        app.listen(port, () => {
            console.log(`Server started at ${serverUrl}`);
            // openBrowser(serverUrl, docName);
        });
    }
}

startApp();
