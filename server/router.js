const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const {Player, Species, Planet, Government, Civilization} = require('./models.js');


// Middleware

const requestRouter = express.Router();

requestRouter.use(bodyparser.urlencoded({extended: true}));

requestRouter.use(session({
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

//  Basic navigation

requestRouter.get('/', (req, res) => {
    res.render('index');
});


// User authentication

requestRouter.post('/login', async (req,res) => {
    try {
        await Player.findOne({email: req.body.email}, (err, result) => {
            if(err) {console.log(err)}
            else {
                if(result) {
                    if(result.password==req.body.password) {
                        req.session.authenticated = true;
                        req.session.userid = result._id;
                        res.redirect('/game');
                    }
                    else res.render('errorpage', {message: 'Incorrect password.'});
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
            var newPlayer = new Player({email: req.body.email, password: req.body.password});
            await newPlayer.save();
            var newCiv = new Civilization({player: newPlayer._id});
            res.redirect('/game');
        }
        catch(e) {
            res.send('Sorry, there is already an account associated with that email address.');
        }
    }
    else {
        res.render('errorpage', {message:'Passwords do not match.'});
    }
});

//
// Game requests
//

// Preamble

const loggedin = (req, res, next) => {
    try {
        if(req.session.authenticated) next();
        else res.render('errorpage', {message: "You've got to be logged in to do that."});
    }
    catch {
        res.status(400);
    }

}

const findCiv = (req, res, next) => {
    if(req.session.civ) {
        if(req.session.civ.government) next();
        else res.redirect('/game/newcivilization');
    }
    else Civilization.findOne({player: req.session.userid}, (err, result) => {
        if(err) {
            res.render('errorpage', {message: "Oops!  Something went wrong.  Try again maybe...?"});
        }
        else if(result) {
            req.session.civ = result;
            if(req.session.civ.government) next();
            else res.redirect('/game/newcivilization');
        }
        else {
            let c = new Civilization({player: req.session.userid});
            c.save();
            req.session.civ = c;
            res.redirect('/game/newcivilization');
        }
    });
}

const gameRouter = express.Router();
gameRouter.use(loggedin);

requestRouter.use('/game', gameRouter);


// Navigation

gameRouter.get('/', findCiv, async (req, res) => {
    res.render('headquarters');
});
       


//
//  CIVILIZATION CREATION
//

gameRouter.get('/newcivilization', (req,res) => {
    if(!req.session.civ) res.render('errorpage',{message:'Having some issues loading your civilization...  Try again?'});
    else {
        var newCiv = req.session.civ;
        var fluff = {
            world: '',
            species: '',
        };
        try {
            if(newCiv.homeworld) Planet.findOne({_id: newCiv.homeworld}, (error, result) => {
                if(error||!result) {
                    res.render('newciv', {data: fluff})
                }
                else {
                    fluff.world = "Your civilization was born on "+result.name+"."
                    if(newCiv.species) Species.findOne({_id: newCiv.species}, (errr, resss) => {
                        if(errr) {
                            console.log(errr);
                            res.render('newciv', {data: fluff})
                        }
                        else if(resss) {
                            fluff.world
                        }
                        else res.render('newciv', {data: fluff})
                    });
                    else res.render('newciv', {data: fluff})
                }
            });
            else res.render('newciv', {data: fluff})
        }
        catch {
            res.render('newciv', {data: fluff})
        }
    }
});


gameRouter.post('/newhomeworld', async (req,res) => {
    try {
        var newPlanet = new Planet({name: req.body.name, climate: req.body.climate});
        await newPlanet.save();
        await Civilization.findOne({player: req.session.userid}, (err, result) => {
            if(err) {
                res.send('_ERROR_');
            }
            if(result) {
                result.homeworld = newPlanet._id;
                result.save();
                req.session.civ = result;
                res.send('SUCCESS');
            }
        });
    }
    catch (e) {
        res.render('errorpage', {message: 'There was an issue creating a new planet.'});
        console.log(e);
    }
});

gameRouter.post('/newspecies', async (req, res) => {
    try {
        var newSpecies = new Species(req.body);
        await newSpecies.save();
        Civilization.findOne({player: req.session.userid}, (err, result) => {
            if(err) {
                res.send('_ERROR_');
            }
            if(result) {
                result.founding_species = newSpecies._id;
                result.save();
                req.session.civ = result;
                res.send('SUCCESS');
            }
        });
    }
    catch (e) {
        res.render('errorpage', {message: 'There was an issue creating a new species.'});
        console.log(e);
    }

});

gameRouter.post('/newgovernment', async (req, res) => {
    try {

    }
    catch (e) {
        res.render('errorpage', {message: 'There was an issue creating a new government.'});
        console.log(e);
    }
});

module.exports = requestRouter;