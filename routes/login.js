'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport")


router.get("/login", (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect("/");
    }

    const { alert, errorType } = req.query;
    let message = '';
    if (alert === 'errore') {
        if (errorType === 'non_trovato') {
            message = 'Utente non trovato. Verifica l\'email inserita.';
        } else if (errorType === 'password_errata') {
            message = 'Password errata.';
        } else if (errorType === 'non_autorizzato') {
            message = 'Accesso non autorizzato. Effettua il login per accedere alla dashboard.';
        } else if (errorType === 'logout') {
            message = 'Logout non disponibile.';
        } else{
            message = 'Credenziali non valide. Riprova.';
        }
    } else if (alert === 'logout') {
        message = 'Logout effettuato con successo.';
    }
    res.render("login", { alert, message, isAuth: req.isAuthenticated() });
});


router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, utente, info) => {        
        if (err) {
            return next(err);
        }
        if (!utente) {
            let errorType = '';
            if (info && info.message) {
                if (info.message == 'Utente non trovato.') {
                    errorType = 'non_trovato';
                } else if (info.message == 'Password errata.') {
                    errorType = 'password_errata';
                }
            }
            return res.redirect(`/login?alert=errore&errorType=${errorType}`);
        }
        req.login(utente, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/?alert=login");
        });
    })(req, res, next);
});

module.exports = router