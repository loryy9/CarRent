'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")

router.get("/dashboard/getAuto/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.ruolo != 1) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const id = req.params.id;
    try {
        const auto = await dao.getAutoById(id);
        if (auto) {
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                view: "modificaAuto",
                auto: auto,
                alert: "",
                message: ""
            });
        } else {
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                alert: "errore",
                message: "Auto non trovata.",
                user: req.user,
                view: ""
            });
        }
    } catch (error) {
        console.log("Errore durante il recupero dell'auto:", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante il recupero dell'auto.",
            user: req.user,
            view: ""
        });
    }
});

router.post("/dashboard/deleteAuto/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.ruolo != 1) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const id = req.params.id;
    try {
        await dao.deleteAuto(id);
        return res.redirect("/dashboard?alert=elencoAuto&message=Auto eliminata con successo");
    } catch (error) {
        console.log("Errore durante l'eliminazione dell'auto:", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'eliminazione dell'auto.",
            user: req.user,
            view: ""
        });
    }
});

router.post("/dashboard/addAuto", [
    check('marca').notEmpty(),
    check('modello').notEmpty(),
    // check('immagine').isEmail(),
    check('tipologia').notEmpty(),
    check('velocita').notEmpty(),
    check('cavalli').notEmpty(),
    check('prezzo_giornaliero').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array())
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
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
            alert: "success",
            message: "Auto inserita con successo.",
            user: req.user,
            view: "inserimentoAuto",
        })
    } catch (error) {
        console.log("Errore durante l'inserimento dell'auto: ", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'inserimento dell'auto.",
            user: req.user,
            view: "inserimentoAuto"
        })
    }
})

router.post("/dashboard/updateAuto/:id", [
    check('marca').notEmpty(),
    check('modello').notEmpty(),
    // check('immagine').isEmail(),
    check('tipologia').notEmpty(),
    check('velocita').notEmpty(),
    check('cavalli').notEmpty(),
    check('prezzo_giornaliero').notEmpty()
], async (req, res) => {
    if (!req.isAuthenticated() || req.user.ruolo != 1) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        const auto = await dao.getAutoById(req.params.id);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Campi non validi, riprovare.",
            user: req.user,
            view: "modificaAuto",
            auto: auto
        });
    }

    try {
        await dao.updateAuto(req.params.id, req.body);
        return res.redirect("/dashboard?alert=elencoAuto&message=Auto modificata con successo");
    } catch (error) {
        console.log("Errore durante l'aggiornamento dell'auto:", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'aggiornamento dell'auto.",
            user: req.user,
            view: "modificaAuto",
            auto: req.body
        });
    }
});

router.post("/addAutoPreferita/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const id_auto = req.params.id;
    const id_utente = req.user.id;

    try {
        const isPreferita = await dao.isAutoPreferita(id_auto, id_utente);
        console.log(isPreferita)
        if (isPreferita) {
            return res.redirect(req.headers.referer || '/catalogo')
        }
        await dao.addAutoPreferita(id_auto, id_utente);
        await dao.incrementaContatorePreferite(id_auto);
        return res.redirect(req.headers.referer || '/catalogo')
    } catch (error) {
        return res.render("index", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'aggiunta dell'auto preferita.",
            user: req.user,
            view: ""
        })
    }
})

router.post("/removeAutoPreferita/:id", async (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const id_auto = req.params.id;
    const id_utente = req.user.id;
    try {
        await dao.removePreferita(id_auto, id_utente);
        await dao.decrementaContatorePreferite(id_auto);
        return res.redirect(req.headers.referer || '/catalogo')
    } catch (error) {
        return res.render("index", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante la rimozione dell'auto preferita.",
            user: req.user,
            view: ""
        })
    }
})

module.exports = router