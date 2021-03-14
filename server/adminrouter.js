const express = require('express');
const {Planet, Species, Player} = require('./models.js');

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

module.exports = adminRouter;
