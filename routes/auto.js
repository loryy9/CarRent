'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")
const multer = require('multer');
const path = require('path');
const { isAuth, isAdmin } = require("../public/js/auth")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

router.get("/dashboard/getAuto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
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
    if (!isAuth(req) || !isAdmin(req)) {
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

router.post("/dashboard/addAuto", upload.single('immagine'), async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const { marca, modello, tipologia, velocita, cavalli, prezzo_giornaliero, carburante } = req.body;

    try {
        const immagine = req.file ? `/uploads/${req.file.filename}` : null;

        await dao.newAuto({
            marca,
            modello,
            immagine,
            velocita,
            cavalli,
            tipologia,
            prezzo_giornaliero,
            carburante
        });

        return res.redirect("/dashboard?alert=elencoAuto&message=Auto inserita con successo");
    } catch (error) {
        console.error("Errore durante l'inserimento dell'auto:", error);
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante l'inserimento dell'auto.",
            user: req.user,
            view: "inserimentoAuto"
        });
    }
});

router.post("/dashboard/updateAuto/:id", upload.single('immagine'), [
    check('marca').notEmpty(),
    check('modello').notEmpty(),
    check('tipologia').notEmpty(),
    check('velocita').notEmpty(),
    check('cavalli').notEmpty(),
    check('prezzo_giornaliero').notEmpty(),
    check('carburante').notEmpty()
], async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
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
        const autoEsistente = await dao.getAutoById(req.params.id);

        const immagine = req.file ? `/uploads/${req.file.filename}` : autoEsistente.immagine;

        await dao.updateAuto(req.params.id, req.body, immagine);
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
    if (!isAuth(req)) {
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
    if (!isAuth(req)) {
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

router.get("/prenotazione/getAuto/:id", async (req, res) => {
    if (!isAuth(req)) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const id = req.params.id;
    try {
        const auto = await dao.getAutoById(id);
        const pacchetti = await dao.getAllPacchetti();
        if (auto) {
            return res.render("prenotazione", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                auto: auto,
                pacchetti: pacchetti,
                alert: "",
                message: ""
            });
        } else {
            res.redirect(req.headers.referer || '/catalogo');
        }
    } catch (error) {
        console.log("Errore durante il recupero dell'auto:", error);
        let preferite_user = []
        if (req.user) {
            preferite_user = await dao.getPreferiteByUserId(req.user.id);
        }
        return res.render("catalogo", {
            isAuth: req.isAuthenticated(),
            alert: "errore",
            message: "Errore durante il recupero dell'auto.",
            user: req.user || { ruolo: 0 },
            preferite_user: preferite_user,
        });
    }
});

module.exports = router