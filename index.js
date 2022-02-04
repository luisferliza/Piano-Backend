const express = require('express');
const { routerApi } = require('./routes');
require('dotenv').config();

const app = express()
app.use(express.json());
const port = 3001

// Configuracion de los CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    next();
});

routerApi(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))