'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport");
const { isAuth } = require("../middleware/auth");

router.get("/login", (req, res) => {
    if (isAuth(req)) {
        return res.redirect("/");
    }
    
    res.render("login", { isAuth: req.isAuthenticated() });
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, utente, info) => {        
        if (err) {
            return next(err);
        }
        
        if (!utente) {
            req.flash("error_msg", "Credenziali errate.");
            return res.redirect('/login');
        }
        
        req.login(utente, (err) => {
            if (err) {
                return next(err);
            }
            
            req.flash("success_msg", "Login effettuato con successo.");            
            return res.redirect("/");
        });
    })(req, res, next);
});

module.exports = router