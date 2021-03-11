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

// Database
const dburl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/onsolarsails';
mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true});

// Server set-up
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
    secret: process.env.SECRET || 'goldfish',
    resave: false,
    saveUninitialized: false,
    name: 'onsolarsails'
}));

app.use((req,res,next)=>{
    console.log(req.originalUrl);
    next();
})

app.use('/admin', adminRouter);
app.use('/game', gameRouter);
app.use('/', requestRouter);

const server = http.createServer(app);

server.listen(2000, () => {
    console.log("Server running.");
});
