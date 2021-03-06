const express = require('express');
const path = require('path');
const {Planet, Civilization, Species} = require('./models/usermodels.js');

//
// Game requests
//

// Setup

const gameRouter = express.Router();

const loggedin = (req, res, next) => {
    try {
        if(req.session.authenticated) {
            next();
        }
        else res.render('errorpage', {message: "You've got to be logged in to do that."});
    }
    catch {
        res.status(400);
    }
}

gameRouter.use(loggedin);

const gotCiv = (req, res, next) => {
    if(req.session.civ) {
        if(req.session.civ.government) next();
        else res.redirect('newcivilization/');
    }
    else {
        Civilization.findOne({player: req.session.userid}, async (error, result)=>{
            if(error) res.status(500);
            else if(!result) {
                try {
                    let civvie = new Civilization({player: req.session.userid});
                    await civvie.save();
                    res.redirect('newcivilization/')
                }
                catch(e) {
                    res.status(500);
                }
            }
            else {
                req.session.civ = result;
                if(req.session.civ.government) next();
                else res.redirect('newcivilization/')
            }
        });
    }
}





// Navigation

gameRouter.get('/', gotCiv, async (req, res) => {
    console.log(req.session);
    res.render('gamepanel');
});

gameRouter.get('/concern/:conc', async(req, res) => {
        var dataset = [];
        switch(req.params.conc) {
            case 'fleets':
                break;
            case 'planets':
                let intel = req.session.civ.government.intelligence;
                let revised = intel;
                for(let element of intel) {
                    console.log(element);
                    try {
                        let p = await Planet.findById(element.planet).exec();
                        let entry = {
                            'id': p._id,
                            'name': p.name,
                            'size': p.size,
                        }
                        dataset.push(point);
                    }
                    catch(e) {
                        console.log(e);
                    }
                }
                break;
            default:
                break;
        }
        res.render(path.join('concerns/',req.params.conc), {session: req.session, data: dataset});
});

//
//  CIVILIZATION CREATION
//

gameRouter.get('/newcivilization/', async (req,res) => {
    console.log(req.session);
    if(req.session.civ.government) res.redirect('/game/')
    else {
        var p;
        var s;
        try {
            let newCiv = req.session.civ;
            console.log(newCiv);
            if (newCiv.homeworld) p = await Planet.findById(newCiv.homeworld);
            if (newCiv.founding_Species) s = await Species.findById(newCiv.founding_species);
        }
        catch(e) {
            console.log(e);
        }
        res.render('newciv', {homeworld: p, species: s});
    }
});


gameRouter.post('/newcivilization/newhomeworld', async (req,res) => {
    try {
        var newPlanet = new Planet({name: req.body.name, climate: req.body.climate});
        await newPlanet.save();
        var civ = await Civilization.findOne({player:req.session.userid});
        civ.homeworld = newPlanet._id;
        civ.government.intelligence.push({planet: newPlanet._id, level: 5});
        await civ.save();
        res.send('SUCCESS');
    }
    catch (e) {
        res.status(500);
        console.log(e);
    }
});

gameRouter.post('/newcivilization/newspecies', async (req, res) => {
    try {
        var newSpecies = new Species(req.body);
        await newSpecies.save();
        var civ = await Civilization.findOne({player:req.session.userid});
        civ.founding_species = newSpecies._id;
        await civ.save();
        res.send('SUCCESS');
    }
    catch (e) {
        res.status(500);
        console.log(e);
    }

});

gameRouter.post('/newcivilization/newgovernment', async (req, res) => {
    console.log(req.body);
    try {
        var civ = await Civilization.findOne({player:req.session.userid});
        civ.government = {
            type: 'player',
            name: req.body,
            intelligence: []
        }
        await civ.save();
        res.status(200);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

module.exports = gameRouter;