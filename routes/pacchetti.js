'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")
const { isAuth, isAdmin } = require("../public/js/auth")

router.get("/dashboard/getPacchetto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const id = req.params.id;
        try {
            const pacchetto = await dao.getPacchettoById(id);
            if (pacchetto) {
                return res.render("dashboard", {
                    isAuth: req.isAuthenticated(),
                    user: req.user,
                    view: "modificaPacchetto",
                    pacchetto,
                    alert: "",
                    message: ""
                });
            } else {
                return res.render("dashboard", {
                    isAuth: req.isAuthenticated(),
                    alert: "errore",
                    message: "Pacchetto non trovato.",
                    user: req.user,
                    view: ""
                });
            }
        } catch (error) {
            console.log("Errore durante il recupero del pacchetto:", error);
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                alert: "errore",
                message: "Errore durante il recupero del pacchetto.",
                user: req.user,
                view: ""
            });
        }
})

router.post("/dashboard/addPacchetto", [
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
    if (!isAuth(req) || !isAdmin(req)) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
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
            view: "inserimentoPacchetto",
        })
    }
})

router.post("/dashboard/deletePacchetto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
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

router.post("/dashboard/updatePacchetto/:id", [
    check('nome').notEmpty(),
    check('descrizione').notEmpty(),
    check('prezzo').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Campi non validi, riprovare.",
            user: req.user,
            view: "inserimentoPacchetto",
        });
    }
    if (!isAuth(req) || !isAdmin(req)) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    try {
        await dao.updatePacchetto(
            req.params.id,
            req.body
        );
        return res.redirect("/dashboard?alert=elencoPacchetti&message=Pacchetto aggiornato con successo");
    } catch (error) {
        console.log("Errore durante l'aggiornamento del pacchetto: ", error);
        
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'aggiornamento del pacchetto.",
            user: req.user,
            view: "inserimentoPacchetto",
        });
    }
});

module.exports = router
