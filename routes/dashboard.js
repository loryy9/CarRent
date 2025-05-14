'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")


router.get('/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }

    const alert = req.query.alert || '';
    const user = req.user;
    let message = req.query.message || '';
    let view = '';
    let auto = []; 
    let preferite_user = [];
    let pacchetti = [];
    let categorie = [];

    if (alert === 'cancellazione') {
        message = 'Utente cancellato con successo.';
    } else if (alert === 'inserimentoAuto') {
        view = 'inserimentoAuto';
    } else if (alert === 'elencoAuto') {
        view = 'elencoAuto';
        try {
            auto = await dao.getAllAuto(); 
        } catch (error) {
            console.error("Errore durante il recupero delle auto:", error);
        }
    } else if (alert === 'autoPreferite'){
        view = 'autoPreferite';
        try {
            auto = await dao.getAutoPreferite();
            preferite_user = await dao.getPreferiteByUserId(req.user.id);
        } catch (error) {
            console.error("Errore durante il recupero delle auto preferite:", error);
        }
    } else if( alert === 'elencoPacchetti') {
        view = 'elencoPacchetti'
        try {
            pacchetti = await dao.getAllPacchetti();     
        } catch (error) {
            console.error("Errore durante il recupero dei pacchetti: ", error)
        }
    } else if ( alert === 'inserimentoPacchetto' ) {
        categorie = await dao.getCategoriaPacchetti();
        console.log(categorie);
        view = 'inserimentoPacchetto'
    }

    res.render('dashboard', { user, alert, message, view, isAuth: req.isAuthenticated(), auto, preferite_user, pacchetti, categorie });
});

module.exports = router