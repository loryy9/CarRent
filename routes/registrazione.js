'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport")
const { check, validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const dao = require("../models/dao")
const { isAuth } = require('../public/js/auth')

router.get("/registrazione", (req, res) => {
    if (isAuth(req)) {
        return res.redirect("/");
    }
    
    const alert = req.session.alert || '';
    const message = req.session.message || '';
    
    delete req.session.alert;
    delete req.session.message;
    
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
        req.session.alert = "errore";
        req.session.message = "Campi non validi, riprovare.";
        
        return res.render("registrazione", { 
            isAuth: req.isAuthenticated(),
            user: req.body 
        });
    }

    try {
        const cryptoPwd = await bcrypt.hash(req.body.password, 10);
        await dao.newUser(
            req.body, 
            cryptoPwd
        );
        
        req.session.alert = "success";
        req.session.message = "Registrazione effettuata con successo.";
        
        return res.redirect("/");
    } catch (error) {
        console.log("Errore durante la registrazione: ", error);
        
        req.session.alert = "errore";
        req.session.message = "Errore durante la registrazione. Potrebbe essere che l'email sia già in uso.";
        
        return res.render("registrazione", { 
            isAuth: req.isAuthenticated(),
            user: req.body
        });
    }
});

module.exports = router