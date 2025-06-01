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
    
    res.render("registrazione", { isAuth: req.isAuthenticated() });
})

router.post("/registrazione", [
    check('nome').notEmpty(),
    check('cognome').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('data_nascita').optional().isDate(),
    check('telefono').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        req.flash("error_msg", "Campi non validi, riprovare."); 
        
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
        
        req.flash("success_msg", "Registrazione effettuata con successo.");        
        return res.redirect("/");
    } catch (error) {
        console.log("Errore durante la registrazione: ", error);
        
        req.flash("error_msg", "Errore durante la registrazione");
        
        return res.render("registrazione", { 
            isAuth: req.isAuthenticated(),
            user: req.body
        });
    }
});

module.exports = router