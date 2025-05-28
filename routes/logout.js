"use strict";

const express = require('express');
const passport = require('passport');
const { isAuth } = require('../public/js/auth');
const router = express.Router();

router.get('/logout', (req, res, next) => {
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Devi effettuare il login prima di poter fare logout.";
        return res.redirect('/login');
    }
    
    req.logout((err) => {
        if (err) {
            console.error('Errore durante il logout:', err);
            req.session.alert = "errore";
            req.session.message = "Si è verificato un errore durante il logout.";
            return res.redirect('/');
        }
        
        req.session.alert = "success";
        req.session.message = "Logout effettuato con successo.";
        return res.redirect('/login');
    });
});

module.exports = router;