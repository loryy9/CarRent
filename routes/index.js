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
    let top_auto = await dao.getAutoPreferite();
    console.log(top_auto);
    res.render('index', { alert, message, top_auto, isAuth: req.isAuthenticated(), user: req.user || {ruolo: 0} });
});

module.exports = router