'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { isAuth } = require('../public/js/auth')

router.get('/recensioni', async (req, res) => {
    const alert = req.session.alert || '';
    const message = req.session.message || '';
    
    delete req.session.alert;
    delete req.session.message;
    
    try {
        let recensioni = await dao.getAllRecensioni();
        res.render('recensioni', { 
            recensioni, 
            alert, 
            message, 
            isAuth: req.isAuthenticated(),
            user: req.user || {ruolo: 0}
        });
    } catch (error) {
        console.error("Errore durante il recupero delle recensioni:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante il recupero delle recensioni.";
        return res.redirect('/');
    }
})

router.post('/recensioni/add', async (req, res) => {   
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Accesso non autorizzato. Effettua il login.";
        return res.redirect('/login');
    }
    
    const { commento, voto } = req.body;
    try {
        await dao.addRecensione(req.user.id, commento, voto);
        req.session.alert = "success";
        req.session.message = "Recensione aggiunta con successo.";
        return res.redirect('/recensioni');
    } catch (err) {
        console.error("Errore durante l'aggiunta della recensione:", err);
        req.session.alert = "errore";
        req.session.message = "Errore durante l'aggiunta della recensione.";
        return res.redirect('/recensioni');
    }
})

module.exports = router