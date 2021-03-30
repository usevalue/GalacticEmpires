const express = require('express');
const {Planet, Species, Player, Civilization} = require('./models/usermodels.js');

const adminRouter = express.Router();

adminRouter.use((req, res, next)=>{
    if(req.session.isAdmin) next();
    else res.redirect('/');
});

adminRouter.get('/', (req, res)=>{
   res.render('adminpanel', {data: req.session});
});

adminRouter.get('/fetch/:type', async (req, res)=> {
    try {
        var report;
        switch (req.params.type) {
            case 'players':
                report = await Player.find({});
                res.render('reports/players', {data: report})
                break;
            case 'civilizations':
                report = await Civilization.find({});
                res.render('reports/civilizations', {data: report})
                break;
            case 'planets':
                report = await Planet.find({});
                res.render('reports/planets', {data: report})
                break;
            case 'species':
                report = await Species.find({});
                res.render('reports/species', {data: report})
                break;
            default:
                res.status(404);
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
})

adminRouter.post('/setIntel', (req, res)=>{
    console.log(req.body)
    Civilization.findById(req.body.civilization, async (error, civ)=>{
        if(error||!civ) {
            console.log(error);
            res.redirect('/admin');
        }
        else {
            console.log(civ.government.intelligence);
            let found = false;
            civ.government.intelligence.forEach(element => {
                if(!found && element.planet==req.body.planet) {
                    element.level = req.body.level;
                    found= true;
                }
            });
            if(!found) {
                let newintel = {'planet': req.body.planetID, 'level': req.body.level}
                civ.government.intelligence.push(newintel);
            }
            
            console.log(civ.government.intelligence);
            try {
                civ.save();
                res.redirect('/admin/');
            }
            catch (e) {
                console.log(e);
                res.render('errorpage', {message: "Oh no."});
            }
            
        }
    });
});

module.exports = adminRouter;
