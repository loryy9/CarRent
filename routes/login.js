'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport")


router.get("/login", (req, res) => {
    const { alert } = req.query;
    let message = '';
    if (alert === 'errore') {
        message = 'Email o password errati.';
    }
    res.render("login", { message });
});

router.post('/login', (req, res, next) => {
    console.log("Body ricevuto:", req.body);
    
    passport.authenticate("local", (err, utente, info) => {
        console.log("Auth result:", { err, utente, info }); 
        
        if (err) {
            console.error("Errore durante l'autenticazione:", err);
            return next(err);
        }
        if (!utente) {
            console.log("Autenticazione fallita:", info?.message);
            return res.redirect('/login?alert=errore');
        }
        req.login(utente, (err) => {
            if (err) {
                console.error("Errore durante il login:", err);
                return next(err);
            }
            console.log("Login avvenuto con successo:", utente.email);
            return res.redirect("/");
        });
    })(req, res, next);
});

module.exports = router