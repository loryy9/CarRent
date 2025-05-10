'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport")
const { check, validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const dao = require("../models/dao")

router.get("/registrazione", (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect("/");
    }
    const { alert, message } = req.query;
    res.render("registrazione", { alert, message, isAuth: req.isAuthenticated() });
})

router.post("/registrazione", [
    check('nome').notEmpty(),
    check('cognome').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('data_nascita').optional().isDate()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        return res.render("registrazione", { 
            isAuth: req.isAuthenticated(),
            alert : "errore",
            message: "Campi non validi, riprovare.",
            user: req.body 
        });
    }

    try {
        const cryptoPwd = await bcrypt.hash(req.body.password, 10);
        await dao.newUser(
            req.body, 
            cryptoPwd
        );
        return res.redirect("/?alert=registrazione");
    } catch (error) {
        console.log("Errore durante la registrazione: ", error);
        res.render("registrazione", { 
            isAuth: req.isAuthenticated(),
            error: "Errore durante la registrazione. Potrebbe essere che l'email sia già in uso.",
            user: req.body
        });
    }
});

module.exports = router