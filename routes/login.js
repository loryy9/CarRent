'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport");
const { isAuth } = require("../public/js/auth");

router.get("/login", (req, res) => {
    if (isAuth(req)) {
        return res.redirect("/");
    }

    const alert = req.session.alert || '';
    const message = req.session.message || '';
    
    delete req.session.alert;
    delete req.session.message;
    
    res.render("login", { alert, message, isAuth: req.isAuthenticated() });
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, utente, info) => {        
        if (err) {
            return next(err);
        }
        
        if (!utente) {
            req.session.alert = "errore";
            req.session.message = "Credenziali errate.";
            return res.redirect('/login');
        }
        
        req.login(utente, (err) => {
            if (err) {
                return next(err);
            }
            
            req.session.alert = "success";
            req.session.message = "Login effettuato con successo.";
            
            return res.redirect("/");
        });
    })(req, res, next);
});

module.exports = router