'use strict'
const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    const { alert } = req.query;
    let message = '';
    if (alert === 'login'){
        message = 'Login effettuato con successo.';
    } else if (alert === 'registrazione'){
        message = 'Registrazione effettuata con successo.';
    }
    res.render('index', { alert, message, isAuth: req.isAuthenticated() });
});

module.exports = router