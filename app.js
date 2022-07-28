const express = require('express');
const router = require('./router/user');

require('./database/init');
require('./database/models/User');


const app = express();

app.use(express.urlencoded({extended: false}));
app.use('/user', router);

/*
    port: 5000
*/
app.listen(5000, () => {
    console.log('http://localhost:5000');
})