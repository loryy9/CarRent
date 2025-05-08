'use strict'
const express = require("express")
const router = express.Router()

router.get('/dashboard', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }
    res.render('dashboard', {utente: req.user, isAuth: req.isAuthenticated()});
});

module.exports = router