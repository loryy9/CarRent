'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")

router.post("/dashboard/addPacchetto", [
    check('categoria').notEmpty(),
    check('nome').notEmpty(),
    check('descrizione').notEmpty(),
    check('prezzo').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array())
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Campi non validi, riprovare.",
            user: req.user,
            view: "inserimentoPacchetto"
        })
    }

    try {
        await dao.newPacchetto(
            req.body
        );
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "success",
            message: "Pacchetto inserito con successo.",
            user: req.user,
            view: "inserimentoPacchetto",
        })
    } catch (error) {
        console.log("Errore durante l'inserimento del pacchetto: ", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'inserimento del pacchetto.",
            user: req.user,
            view: "inserimentoPacchetto"
        })
    }
})

module.exports = router
