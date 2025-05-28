'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/catalogo', async (req, res) => {
    try {
        let preferite_user = [];
        if (req.user) {
            preferite_user = await dao.getPreferiteByUserId(req.user.id);
        }

        let auto = await dao.getAllAuto();
        let marchi = await dao.getMarchi();

        const { testo, marchio, prezzoMin, prezzoMax } = req.query;

        if (testo) {
            auto = auto.filter(a =>
                a.modello.toLowerCase().includes(testo.toLowerCase()) ||
                a.marca.toLowerCase().includes(testo.toLowerCase())
            );
        }

        if (marchio) {
            auto = auto.filter(a => a.marca.toLowerCase() == marchio.toLowerCase());
        }

        if (prezzoMin) {
            auto = auto.filter(a => a.prezzo_giornaliero >= parseFloat(prezzoMin));
        }
        if (prezzoMax) {
            auto = auto.filter(a => a.prezzo_giornaliero <= parseFloat(prezzoMax));
        }

        res.render('catalogo', {
            auto,
            preferite_user,
            marchi,
            isAuth: req.isAuthenticated(),
            user: req.user || { ruolo: 0 },
            testo,
            marchio,
            prezzoMin,
            prezzoMax
        });
    } catch (err) {
        console.error(err);
        req.flash("error_msg", "Errore durante il caricamento del catalogo.");
        return res.redirect('/');
    }
});

module.exports = router;