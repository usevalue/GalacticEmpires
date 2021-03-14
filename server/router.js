const express = require('express');
const {Player, Civilization} = require('./models.js');
const bcrypt = require('bcrypt');
const salt = 10;
// Middleware

const requestRouter = express.Router();


//  Basic navigation

requestRouter.get('/', (req, res) => {
    res.render('index');
});


// User authentication

requestRouter.post('/login', async (req,res) => {
    try {
        await Player.findOne({username: req.body.username}, async (err, result) => {
            if(err) {console.log(err)}
            else {
                if(result) {
                    try {
                        let passmatch = bcrypt.compare(req.body.password, result.password)
                        if(passmatch) {
                            req.session.authenticated = true;
                            req.session.username = result.username;
                            req.session.userid = result._id;
                            req.session.isAdmin = result.isAdmin;
                            req.session.civ = await Civilization.findOne({player: result._id});
                            res.redirect('/game/');
                        }
                        else res.render('errorpage', {message: 'Incorrect password.'});
                    }
                    catch(e) {
                        console.log(e)
                        res.send('ERROROMG')
                    }
                }
                else {
                    res.render('errorpage', {message: 'No account associated with that email address.'});
                }

            }
        });
    }
    catch(e) {
        console.log(e);
        res.render('errorpage', {message:'There was an error processing your login.'});
    }
});

requestRouter.post('/register', async (req, res) => {
    if(req.body.password==req.body.passwordconfirm) {
        try {
            let hashedPass = await bcrypt.hash(req.body.password,salt);
            var newPlayer = new Player({username: req.body.name, password: hashedPass});
            await newPlayer.save();
            var newCiv = new Civilization({player: newPlayer._id});
            await newCiv.save();
            req.session.authenticated = true;
            req.session.userid = newPlayer._id;
            req.session.civ = newCiv;
            res.redirect('/game/');
        }
        catch(e) {
            console.log(e);
            res.render('errorpage', {message: e});
        }
    }
    else {
        res.render('errorpage', {message:'Passwords do not match.'});
    }
});

requestRouter.get('/logout', (req,res) => {
    req.session.destroy(()=>{res.redirect('/')});
});

module.exports = requestRouter;