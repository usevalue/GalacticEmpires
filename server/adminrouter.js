const express = require('express');
const {Planet, Species, Player} = require('./models.js');

const adminRouter = express.Router();

//adminRouter.get('/', (req, res)=>{
//    res.render('adminpanel', {data: req.session});
//});

adminRouter.get('/fetchlist/Players', async (req, res)=> {
    try {
        var all = await Player.find({});
        var report = []
        all.forEach(element => {
            report.push({
                name: element.email,
                civ: element.civilization
            })
        });
        res.status(200).send(report);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

adminRouter.get('/fetchlist/Planets', async (req, res)=> {
    try {
        var all = await Planet.find({});
        res.status(200).send(all);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

adminRouter.get('/fetchlist/Species', async (req, res)=> {
    try {
        var all = await Species.find({});
        res.status(200).send(all);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

module.exports = adminRouter;
