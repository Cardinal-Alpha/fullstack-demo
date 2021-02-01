const {createProxyMiddleware} = require('http-proxy-middleware');

const proxyOpt = {
    target: 'http://backend:8000/',
    pathRewrite: {'^/api':''}
};

module.exports.proxy = createProxyMiddleware(proxyOpt);