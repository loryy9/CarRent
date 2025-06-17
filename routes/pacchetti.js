'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")
const { isAuth, isAdmin } = require("../middleware/auth")

router.get("/getPacchetto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
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
            req.flash("error_msg", "Pacchetto non trovato.");
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                view: ""
            });
        }
    } catch (error) {
        console.log("Errore durante il recupero del pacchetto:", error);
        req.flash("error_msg", "Errore durante il recupero del pacchetto.");
        return res.redirect("/dashboard/elencoPacchetti");
    }
})

router.post("/addPacchetto", [
    check('nome').notEmpty(),
    check('descrizione').notEmpty(),
    check('prezzo').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array())
        req.flash("error_msg", "Campi non validi, riprovare.");
        return res.redirect("/dashboard/inserimentoPacchetto");
    }
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/login');
    }

    const {nome} = req.body;

    if(await dao.getPacchettoByNome(nome)) {
        req.flash("error_msg", "Pacchetto con questo nome già esistente.");
        return res.redirect("/dashboard/inserimentoPacchetto");
    }

    try {
        await dao.newPacchetto(req.body);
        req.flash("success_msg", "Pacchetto inserito con successo.");
        const pacchetti = await dao.getAllPacchetti();
        res.redirect("/dashboard/elencoPacchetti");
    } catch (error) {
        console.log("Errore durante l'inserimento del pacchetto: ", error);
        req.flash("error_msg", "Errore durante l'inserimento del pacchetto.");
        res.redirect("/dashboard/inserimentoPacchetto");
    }
})

router.post("/deletePacchetto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/login');
    }

    const id = req.params.id;
    try {
        await dao.deletePacchetto(id);
        req.flash("success_msg", "Pacchetto eliminato con successo.");
        return res.redirect("/dashboard/elencoPacchetti");
    } catch (error) {
        console.log("Errore durante l'eliminazione del pacchetto:", error);
        req.flash("error_msg", "Errore durante l'eliminazione del pacchetto.");
        return res.redirect("/dashboard/elencoPacchetti");
    }
})

router.post("/updatePacchetto/:id", [
    check('nome').notEmpty(),
    check('descrizione').notEmpty(),
    check('prezzo').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        req.flash("error_msg", "Campi non validi, riprovare.");
        return res.redirect(`/dashboard/modificaPacchetto/${req.params.id}`);
    }
    
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/login');
    }

    try {
        await dao.updatePacchetto(req.params.id, req.body);
        req.flash("success_msg", "Pacchetto aggiornato con successo.");
        return res.redirect("/dashboard/elencoPacchetti");
    } catch (error) {
        console.log("Errore durante l'aggiornamento del pacchetto: ", error);
        req.flash("error_msg", "Errore durante l'aggiornamento del pacchetto.");
        return res.redirect(`/dashboard/modificaPacchetto/${req.params.id}`);
    }
});

module.exports = router