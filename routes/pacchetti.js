'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")
const { isAuth, isAdmin } = require("../public/js/auth")

router.get("/dashboard/getPacchetto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/login');
    }

    const id = req.params.id;
    try {
        const pacchetto = await dao.getPacchettoById(id);
        if (pacchetto) {
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                view: "modificaPacchetto",
                pacchetto
            });
        } else {
            req.session.alert = "errore";
            req.session.message = "Pacchetto non trovato.";
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                view: ""
            });
        }
    } catch (error) {
        console.log("Errore durante il recupero del pacchetto:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante il recupero del pacchetto.";
        return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                view: ""
            });
    }
})

router.post("/dashboard/addPacchetto", [
    check('nome').notEmpty(),
    check('descrizione').notEmpty(),
    check('prezzo').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array())
        req.session.alert = "errore";
        req.session.message = "Campi non validi, riprovare.";
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: "inserimentoPacchetto"
        })
    }
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/login');
    }

    try {
        await dao.newPacchetto(req.body);
        req.session.alert = "success";
        req.session.message = "Pacchetto inserito con successo.";
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: "elencoPacchetti"
        })
    } catch (error) {
        console.log("Errore durante l'inserimento del pacchetto: ", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante l'inserimento del pacchetto.";
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: "inserimentoPacchetto"
        })
    }
})

router.post("/dashboard/deletePacchetto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/login');
    }

    const id = req.params.id;
    try {
        await dao.deletePacchetto(id);
        req.session.alert = "elencoPacchetti";
        req.session.message = "Pacchetto eliminato con successo";
        return res.redirect("/dashboard");
    } catch (error) {
        console.log("Errore durante l'eliminazione del pacchetto:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante l'eliminazione del pacchetto.";
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: ""
        });
    }
})

router.post("/dashboard/updatePacchetto/:id", [
    check('nome').notEmpty(),
    check('descrizione').notEmpty(),
    check('prezzo').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        req.session.alert = "errore";
        req.session.message = "Campi non validi, riprovare.";
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: "inserimentoPacchetto"
        });
    }
    
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/login');
    }

    try {
        await dao.updatePacchetto(req.params.id, req.body);
        req.session.alert = "elencoPacchetti";
        req.session.message = "Pacchetto aggiornato con successo";
        return res.redirect("/dashboard");
    } catch (error) {
        console.log("Errore durante l'aggiornamento del pacchetto: ", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante l'aggiornamento del pacchetto.";
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: "inserimentoPacchetto"
        });
    }
});

module.exports = router