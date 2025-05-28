'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/', async (req, res) => {
    const alert = req.session.alert || '';
    const message = req.session.message || '';
    
    delete req.session.alert;
    delete req.session.message;
    
    try {
        let preferite_user = []
        if (req.user) {
            preferite_user = await dao.getPreferiteByUserId(req.user.id);
        }
        
        let top_auto = await dao.getAutoPreferite();
        let recensioni = await dao.getRecensioniHome();
        
        res.render('index', { 
            alert, 
            message, 
            top_auto, 
            preferite_user, 
            recensioni, 
            isAuth: req.isAuthenticated(), 
            user: req.user || {ruolo: 0} 
        });
    } catch (error) {
        console.error("Errore nella pagina principale:", error);
        req.session.alert = "errore";
        req.session.message = "Si è verificato un errore durante il caricamento della pagina.";
        res.redirect('/'); 
    }
});

module.exports = router