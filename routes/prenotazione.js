'use strict'
const express = require('express')
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")
const { isAuth, isAdmin } = require('../public/js/auth')

router.post("/prenotazioni/controllo_disponibilita", [
    check("data_inizio").notEmpty(),
    check("data_fine").notEmpty(),
    check("id_auto").notEmpty()
], async (req, res) => {   
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Accesso non autorizzato. Effettua il login.";
        return res.redirect('/login');
    } 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() })
    }
    try{
        const { data_inizio, data_fine, id_auto } = req.body
        const disponibile = await dao.verificaDisponibilita(data_inizio, data_fine, id_auto)
        return res.json({ success: true, disponibile: disponibile })
    } catch (err) {
        console.error(err)
        return res.json({ success: false, errors: "errore_query" })
    }
})

router.post("/prenotazioni/crea_prenotazione", [
    check("id_auto").notEmpty(),
    check("id_utente").notEmpty(),
    check("data_inizio").notEmpty(),
    check("data_fine").notEmpty(),
    check("pacchetto").notEmpty(),
    check("totale_giorni").notEmpty(),
    check("prezzo_totale").notEmpty()
], async (req, res) => {
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Accesso non autorizzato. Effettua il login.";
        return res.redirect('/login');
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array())
        return res.json({ success: false, errors: errors.array() })
    }
    try{
        console.log("ID Auto: " + req.body.id_auto)
        const { id_auto, id_utente, data_inizio, data_fine, pacchetto, totale_giorni, prezzo_totale } = req.body
        await dao.creaPrenotazione(id_auto, id_utente, data_inizio, data_fine, pacchetto, totale_giorni, prezzo_totale)
        return res.json({ success: true })
    } catch (err) {
        console.error(err)
        return res.json({ success: false, errors: "errore_query" })
    }
})

router.post("/dashboard/deletePrenotazione/:id", async (req, res) => {
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Accesso non autorizzato. Effettua il login.";
        return res.redirect('/login');
    }

    const id = req.params.id;
    try {
        await dao.deletePrenotazione(id);
        if (isAdmin(req)) {
            req.session.alert = "allPrenotazioni";
            req.session.message = "Prenotazione eliminata con successo.";
            return res.redirect("/dashboard");
        }
        req.session.alert = "prenotazioniUtente";
        req.session.message = "Prenotazione eliminata con successo.";
        return res.redirect("/dashboard");
    } catch (error) {
        console.log("Errore durante l'eliminazione della prenotazione:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante l'eliminazione della prenotazione";
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: ""
        });
    }
});

module.exports = router