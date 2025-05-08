'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport")
const bcrypt = require("bcrypt")
const dao = require("../models/dao")

router.get("/registrazione", (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.render("registrazione", { isAuth: req.isAuthenticated() });
})

router.post("/registrazione", async (req, res) => {
    try {
        const cryptoPwd = await bcrypt.hash(req.body.password, 10);
        await dao.newUser(
            req.body, 
            cryptoPwd
        );
        return res.redirect("/");
    } catch (error) {
        console.log("Errore durante la registrazione: ", error);
        res.redirect("/registrazione");
    }
});

module.exports = router