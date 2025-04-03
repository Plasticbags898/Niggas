require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const target = process.env.TARGET_URL || 'https://www.wikipedia.org';

// Proxy configuration
const proxyOptions = {
    target,
    changeOrigin: true,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': target,
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-For', '');
    },
    onError: (err, req, res) => {
        res.status(500).send('Proxy is currently down, try again later.');
    }
};

app.use('/', createProxyMiddleware(proxyOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Stealth Proxy Running on Port ${PORT}`);
});
