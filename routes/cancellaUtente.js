'use strict'
const express = require("express")
const router = express.Router()
const passport = require("../models/passport")
const dao = require("../models/dao")
const { isAuth } = require("../public/js/auth")

router.post("/cancella-utente", async (req, res) => {
    const id = req.user.id;
    if (!isAuth(req)) {
        res.redirect("/login?alert=non_autorizzato");
    }

    try {
        await dao.deleteUser(id)

        req.logout((err) => {
            if (err) {
                console.error('Errore durante il logout:', err);
                return next(err);
            }
            res.redirect('/?alert=cancellazione')
        });
    } catch (error) {
        console.error("Errore durante la cancellazione dell'utente:", error);
        res.redirect("/dashboard?alert=erroreCancellazione");
    }

});

module.exports = router