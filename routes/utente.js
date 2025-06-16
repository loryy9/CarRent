'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport")
const dao = require("../models/dao")
const { isAuth } = require("../public/js/auth")
const { route } = require(".")

router.post("/cancella-utente", async (req, res) => {
    const id = req.user.id;
    if (!isAuth(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect("/login");
    }

    try {
        await dao.deleteUser(id);

        req.logout((err) => {
            if (err) {
                console.error('Errore durante il logout:', err);
                req.flash("error_msg", "Errore durante il logout.");
                return res.redirect("/dashboard");
            }
            req.flash("success_msg", "Utente cancellato con successo.");
            return res.redirect('/');
        });
    } catch (error) {
        console.error("Errore durante la cancellazione dell'utente:", error);
        req.flash("error_msg", "Errore durante la cancellazione dell'utente.");
        return res.redirect("/dashboard");
    }
});

router.get('/modifica_utente', (req, res) => {
    if (!isAuth(req)) {
        req.flash('error_msg', 'Accesso non autorizzato. Effettua il login.');
        return res.redirect('/login');
    }

    const user = req.user; 
    res.render('registrazione', { user, isAuth: req.isAuthenticated(), messages: req.flash() });
});

router.post('/modifica_utente', async (req, res) => {
    if (!isAuth(req)) {
        req.flash('error_msg', 'Accesso non autorizzato. Effettua il login.');
        return res.redirect('/login');
    }

    const id = req.user.id;
    const { nome, cognome, email, data_nascita, telefono } = req.body;

    try {
        await dao.updateUser(id, { nome, cognome, email, data_nascita, telefono });
        req.flash('success_msg', 'Dati utente aggiornati con successo.');
        return res.redirect('/dashboard');
    } catch (error) {
        console.error("Errore durante l'aggiornamento dei dati utente:", error);
        req.flash('error_msg', 'Errore durante l\'aggiornamento dei dati utente.');
        return res.redirect('/modifica_utente');
    }
});

module.exports = router