'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/', async (req, res) => {
    const { alert } = req.query;
    let message = '';
    if (alert === 'login'){
        message = 'Login effettuato con successo.';
    } else if (alert === 'registrazione'){
        message = 'Registrazione effettuata con successo.';
    } else if (alert === 'cancellazione'){
        message = 'Utente cancellato con successo.';
    }
    let preferite_user = []
    if (req.user) {
        preferite_user = await dao.getPreferiteByUserId(req.user.id);
    }
    let top_auto = await dao.getAutoPreferite();
    let recensioni = await dao.getRecensioniHome();
    res.render('index', { alert, message, top_auto, preferite_user, recensioni, isAuth: req.isAuthenticated(), user: req.user || {ruolo: 0} });
});

module.exports = router