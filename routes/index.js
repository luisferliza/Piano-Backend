const express = require('express');
const { usersRouter } = require('./users.routes');


function routerApi(app){
    const routerv1 = express.Router();
    app.use('/api/v1', routerv1);
    routerv1.use('/users', usersRouter)

}

module.exports = {routerApi}