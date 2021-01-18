const express = require('express');

const requestRouter = express.Router();

requestRouter.get('/', (req, res) => {
    res.render('index');
});

module.exports = requestRouter;