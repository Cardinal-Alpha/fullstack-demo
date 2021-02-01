const { parse } = require('url');
const next = require('next');
const express = require('express');
const {proxy} = require('./proxy/proxyApi');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(()=>{
    const server = express();
    server.use('/api', proxy);
    server.use('/files', proxy);
    server.use('/', (req, res, next)=>{
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    });
})