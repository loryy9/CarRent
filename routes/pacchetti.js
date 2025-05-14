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
        let categorie = [];
        try {
            categorie = await dao.getCategoriaPacchetti();
        } catch (error) {
            console.error("Errore nel recupero categorie:", error);
        }
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "success",
            message: "Pacchetto inserito con successo.",
            user: req.user,
            view: "inserimentoPacchetto",
            categorie: categorie
        })
    } catch (error) {
        console.log("Errore durante l'inserimento del pacchetto: ", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'inserimento del pacchetto.",
            user: req.user,
            view: "inserimentoPacchetto",
            categorie: []
        })
    }
})

router.post("/dashboard/deletePacchetto/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.ruolo != 1) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const id = req.params.id;
        try {
            await dao.deletePacchetto(id);
            return res.redirect("/dashboard?alert=elencoPacchetti&message=Pacchetto eliminato con successo");
        } catch (error) {
            console.log("Errore durante l'eliminazione del pacchetto:", error);
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                alert: "errore",
                message: "Errore durante l'eliminazione del pacchetto.",
                user: req.user,
                view: ""
            });
        }
})

module.exports = router
