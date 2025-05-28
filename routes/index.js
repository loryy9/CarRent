'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/', async (req, res) => {
    try {
        let preferite_user = []
        if (req.user) {
            preferite_user = await dao.getPreferiteByUserId(req.user.id);
        }
        
        let top_auto = await dao.getAutoPreferite();
        let recensioni = await dao.getRecensioniHome();
        
        res.render('index', { 
            top_auto, 
            preferite_user, 
            recensioni, 
            isAuth: req.isAuthenticated(), 
            user: req.user || {ruolo: 0} 
        });
    } catch (error) {
        console.error("Errore nella pagina principale:", error);
        req.flash("error_msg", "Errore durante il caricamento della pagina principale.");
        res.redirect('/'); 
    }
});

module.exports = router