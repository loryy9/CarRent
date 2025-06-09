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

router.get("/getAuto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato a visualizzare questa pagina.");
        return res.redirect('/login');
    }

    const id = req.params.id;
    try {
        const auto = await dao.getAutoById(id);
        if (auto) {
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                view: "modificaAuto",
                auto: auto
            });
        } else {
            req.flash("error_msg", "Auto non trovata.");
            return res.render("dashboard", {
                isAuth: req.isAuthenticated(),
                user: req.user,
                view: ""
            });
        }
    } catch (error) {
        console.log("Errore durante il recupero dell'auto:", error);
        req.flash("error_msg", "Errore durante il recupero dell'auto.");
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: ""
        });
    }
});

router.post("/deleteAuto/:id", async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato a eliminare questa auto.");
        return res.redirect('/login');
    }

    const id = req.params.id;
    try {
        await dao.deleteAuto(id);
        req.flash("success_msg", "Auto eliminata con successo.");
        return res.redirect("/dashboard/elencoAuto");
    } catch (error) {
        console.log("Errore durante l'eliminazione dell'auto:", error);
        req.flash("error_msg", "Errore durante l'eliminazione dell'auto.");
        return res.render("dashboard", {
            isAuth: req.isAuthenticated(),
            user: req.user,
            view: ""
        });
    }
});

router.post("/addAuto", upload.single('immagine'), [
    check('marca').notEmpty(),
    check('modello').notEmpty(),
    check('tipologia').notEmpty(),
    check('velocita').notEmpty(),
    check('cavalli').notEmpty(),
    check('prezzo_giornaliero').notEmpty(),
    check('carburante').notEmpty()
], async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato a inserire un'auto.");
        return res.redirect('/login');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        req.flash("error_msg", "Campi non validi, riprovare.");
        return res.redirect("/dashboard/inserimentoAuto");
    }

    const { marca, modello, tipologia, velocita, cavalli, prezzo_giornaliero, carburante } = req.body;

    if (await dao.getAutoByMarca(marca, modello)) {
        req.flash("error_msg", "Un'auto con la stessa marca e modello esiste già.");
        return res.redirect("/dashboard/inserimentoAuto");
    }

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

        req.flash("success_msg", "Auto inserita con successo.");
        return res.redirect("/dashboard/elencoAuto");
    } catch (error) {
        console.error("Errore durante l'inserimento dell'auto:", error);
        req.flash("error_msg", "Errore durante l'inserimento dell'auto.");
        return res.redirect("/dashboard/inserimentoAuto");
    }
});

router.post("/updateAuto/:id", upload.single('immagine'), [
    check('marca').notEmpty(),
    check('modello').notEmpty(),
    check('tipologia').notEmpty(),
    check('velocita').notEmpty(),
    check('cavalli').notEmpty(),
    check('prezzo_giornaliero').notEmpty(),
    check('carburante').notEmpty()
], async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato a modificare questa auto.");
        return res.redirect('/login');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array());
        req.flash("error_msg", "Campi non validi, riprovare.");
        return res.redirect("/dashboard/modificaAuto/" + req.params.id);
    }

    try {
        const autoEsistente = await dao.getAutoById(req.params.id);

        const immagine = req.file ? `/uploads/${req.file.filename}` : autoEsistente.immagine;

        await dao.updateAuto(req.params.id, req.body, immagine);
        req.flash("success_msg", "Auto modificata con successo.");
        return res.redirect("/dashboard/elencoAuto");
    } catch (error) {
        console.log("Errore durante l'aggiornamento dell'auto:", error);
        req.flash("error_msg", "Errore durante l'aggiornamento dell'auto.");
        return res.redirect("/dashboard/modificaAuto/" + req.params.id);
    }
});

router.post("/addAutoPreferita/:id", async (req, res) => {
    if (!isAuth(req)) {
        req.flash("error_msg", "Non sei autorizzato a aggiungere un'auto preferita.");
        return res.redirect('/login');
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
        req.flash("error_msg", "Errore durante l'aggiunta dell'auto preferita.");
        return res.redirect(req.headers.referer || '/catalogo');
    }
})

router.post("/removeAutoPreferita/:id", async (req, res) => {
    if (!isAuth(req)) {
        req.flash("error_msg", "Non sei autorizzato a rimuovere un'auto preferita.");
        return res.redirect('/login');
    }

    const id_auto = req.params.id;
    const id_utente = req.user.id;
    try {
        await dao.removePreferita(id_auto, id_utente);
        await dao.decrementaContatorePreferite(id_auto);
        return res.redirect(req.headers.referer || '/catalogo')
    } catch (error) {
        req.flash("error_msg", "Errore durante la rimozione dell'auto preferita.");
        return res.redirect(req.headers.referer || '/catalogo');
    }
})

router.get("/prenotazione/getAuto/:id", async (req, res) => {
    if (!isAuth(req)) {
        req.flash("error_msg", "Non sei autorizzato a visualizzare questa pagina.");
        return res.redirect('/login');
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
                pacchetti: pacchetti
            });
        } else {
            res.redirect(req.headers.referer || '/catalogo');
        }
    } catch (error) {
        console.log("Errore durante il recupero dell'auto:", error);
        req.flash("error_msg", "Errore durante il recupero dell'auto.");
        return res.redirect("/catalogo")
    }
});

module.exports = router