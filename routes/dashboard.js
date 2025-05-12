'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")


router.get('/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const alert = req.query.alert || '';
    const user = req.user;
    let message = req.query.message || '';
    let view = '';
    let auto = []; 

    if (alert === 'cancellazione') {
        message = 'Utente cancellato con successo.';
    } else if (alert === 'inserimentoAuto') {
        view = 'inserimentoAuto';
    } else if (alert === 'elencoAuto') {
        view = 'elencoAuto';
        try {
            auto = await dao.getAllAuto(); 
        } catch (error) {
            console.error("Errore durante il recupero delle auto:", error);
        }
    }

    res.render('dashboard', { user, alert, message, view, isAuth: req.isAuthenticated(), auto });
});

module.exports = router