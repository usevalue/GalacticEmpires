// Libraries
const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

// My modules
const requestRouter = require('./router.js');
const gameRouter = require('./gamerouter.js');
const adminRouter = require('./adminrouter.js');

// Configuration
const dotenv = require('dotenv').config();
const dburl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/onsolarsails';
const sessionSecret = process.env.SECRET || 'goldfish';
const port = process.env.PORT || 2000;

// Server set-up

mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
const clientPath = path.join(__dirname, '/../client/');
app.use(express.static(path.join(clientPath,'static/')));
app.set('view engine', 'ejs');
app.set('views', path.join(clientPath,'views/'));

app.use(express.urlencoded({extended: true}));

app.use(session({
    cookie: {
        maxAge: 1000*60*60*24*7,
        secure: false
    },
    key: 'user_sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: 'onsolarsails'
}));

app.use((req,res,next)=>{
    console.log(req.originalUrl);
    next();
})

app.use('/admin/', adminRouter);
app.use('/game/', gameRouter);
app.use('/', requestRouter);

const server = http.createServer(app);

server.listen(port, () => {
    console.log("Server running on port "+port+".");
});
