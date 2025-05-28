'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { isAuth } = require('../public/js/auth')

router.get('/recensioni', async (req, res) => {
    
    try {
        let recensioni = await dao.getAllRecensioni();
        res.render('recensioni', { 
            recensioni,
            isAuth: req.isAuthenticated(),
            user: req.user || {ruolo: 0}
        });
    } catch (error) {
        console.error("Errore durante il recupero delle recensioni:", error);
        req.flash("error_msg", "Errore durante il recupero delle recensioni.");
        return res.redirect('/');
    }
})

router.post('/recensioni/add', async (req, res) => {   
    if (!isAuth(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/login');
    }
    
    const { commento, voto } = req.body;
    try {
        await dao.addRecensione(req.user.id, commento, voto);
        req.flash("success_msg", "Recensione aggiunta con successo.");
        return res.redirect('/recensioni');
    } catch (err) {
        console.error("Errore durante l'aggiunta della recensione:", err);
        req.flash("error_msg", "Errore durante l'aggiunta della recensione.");
        return res.redirect('/recensioni');
    }
})

module.exports = router