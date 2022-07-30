const express = require('express');
const router = require('./router/user');

require('./database/init');
require('./database/models/User');


const app = express();

app.all('*', function (req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type');
res.header('Access-Control-Expose-Headers', 'Authorization');
res.header('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({target: 'http://localhost:3000', changeOrigin: true}));
app.use(express.urlencoded({extended: false}));
app.use(router);

/*
    port: 5000
*/
app.listen(5000, () => {
    console.log('http://localhost:5000');
})