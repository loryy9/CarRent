"use strict";

const express = require('express');
const passport = require('passport');
const { isAuth } = require('../public/js/auth');
const router = express.Router();

router.get('/logout', (req, res, next) => {
    if (!isAuth(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/login');
    }
    
    req.logout((err) => {
        if (err) {
            console.error('Errore durante il logout:', err);
            req.flash("error_msg", "Si è verificato un errore durante il logout.");
            return res.redirect('/');
        }
        
        req.flash("success_msg", "Logout effettuato con successo.");
        return res.redirect('/login');
    });
});

module.exports = router;