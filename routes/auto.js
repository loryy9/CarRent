'use strict'
const express = require("express")
const router = express.Router()
const { check, validationResult} = require("express-validator")
const dao = require("../models/dao")

router.post("/addAuto", [
    check('marca').notEmpty(),
    check('modello').notEmpty(),
    // check('immagine').isEmail(),
    check('tipologia').notEmpty(),
    check('velocita').notEmpty(),
    check('cavalli').notEmpty(),
    check('prezzo_giornaliero').notEmpty()
], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log("Errori di validazione:", errors.array())
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert : "errore",
            message: "Campi non validi, riprovare.",
            user: req.user,
            view: "inserimentoAuto"
        })
    }

    try {
        await dao.newAuto(
            req.body
        );
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert : "success",
            message: "Auto inserita con successo.",
            user: req.user,
            view: "inserimentoAuto"
        })
    } catch (error) {
        console.log("Errore durante l'inserimento dell'auto: ", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert : "errore",
            message: "Errore durante l'inserimento dell'auto.",
            user: req.user,
            view: "inserimentoAuto"
        })
    }
})

module.exports = router