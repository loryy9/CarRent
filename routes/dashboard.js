'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao");
const { isAuth, isAdmin } = require("../public/js/auth");

router.get('/dashboard', async (req, res) => {
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Accesso non autorizzato. Effettua il login.";
        return res.redirect('/login');
    }

    const alert = req.session.alert || '';
    const message = req.session.message || '';
    
    delete req.session.alert;
    delete req.session.message;
    
    res.render('dashboard', { 
        user: req.user, 
        alert,
        message,
        view: '',
        isAuth: true,
        auto: [],
        preferite_user: [],
        pacchetti: [],
        prenotazioni: []
    });
});

router.get('/dashboard/inserimentoAuto', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/dashboard');
    }
    
    res.render('dashboard', { 
        user: req.user,
        view: 'inserimentoAuto',
        isAuth: true,
        auto: [],
        preferite_user: [],
        pacchetti: [],
        prenotazioni: []
    });
});

router.get('/dashboard/elencoAuto', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/dashboard');
    }
    
    try {
        const auto = await dao.getAllAuto();
        res.render('dashboard', { 
            user: req.user,
            view: 'elencoAuto',
            auto,
            isAuth: true,
            preferite_user: [],
            pacchetti: [],
            prenotazioni: []
        });
    } catch (error) {
        console.error("Errore durante il recupero delle auto:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante il recupero delle auto.";
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/autoPreferite', async (req, res) => {
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Accesso non autorizzato. Effettua il login.";
        return res.redirect('/login');
    }
    
    try {
        const auto = await dao.getAutoPreferite();
        const preferite_user = await dao.getPreferiteByUserId(req.user.id);
        res.render('dashboard', { 
            user: req.user,
            view: 'autoPreferite',
            auto,
            preferite_user,
            isAuth: true,
            pacchetti: [],
            prenotazioni: []
        });
    } catch (error) {
        console.error("Errore durante il recupero delle auto preferite:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante il recupero delle auto preferite.";
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/elencoPacchetti', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/dashboard');
    }
    
    try {
        const pacchetti = await dao.getAllPacchetti();
        res.render('dashboard', { 
            user: req.user,
            view: 'elencoPacchetti',
            pacchetti,
            isAuth: true,
            auto: [],
            preferite_user: [],
            prenotazioni: []
        });
    } catch (error) {
        console.error("Errore durante il recupero dei pacchetti:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante il recupero dei pacchetti.";
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/inserimentoPacchetto', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/dashboard');
    }
    
    res.render('dashboard', { 
        user: req.user,
        view: 'inserimentoPacchetto',
        isAuth: true,
        auto: [],
        preferite_user: [],
        pacchetti: [],
        prenotazioni: []
    });
});

router.get('/dashboard/prenotazioniUtente', async (req, res) => {
    if (!isAuth(req)) {
        req.session.alert = "errore";
        req.session.message = "Accesso non autorizzato. Effettua il login.";
        return res.redirect('/login');
    }
    
    try {
        let prenotazioni = await dao.getPrenotazioniByUserId(req.user.id);
        prenotazioni.forEach((prenotazione) => {
            prenotazione.stato = dao.getStatoPrenotazione(prenotazione);
        });
        res.render('dashboard', { 
            user: req.user,
            view: 'prenotazioniUtente',
            prenotazioni,
            isAuth: true,
            auto: [],
            preferite_user: [],
            pacchetti: []
        });
    } catch (error) {
        console.error("Errore durante il recupero delle prenotazioni:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante il recupero delle prenotazioni.";
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/allPrenotazioni', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.session.alert = "errore";
        req.session.message = "Non sei autorizzato ad accedere a questa sezione.";
        return res.redirect('/dashboard');
    }
    
    try {
        let prenotazioni = await dao.getAllPrenotazioni();
        prenotazioni.forEach((prenotazione) => {
            prenotazione.stato = dao.getStatoPrenotazione(prenotazione);
        });
        res.render('dashboard', { 
            user: req.user,
            view: 'allPrenotazioni',
            prenotazioni,
            isAuth: true,
            auto: [],
            preferite_user: [],
            pacchetti: []
        });
    } catch (error) {
        console.error("Errore durante il recupero delle prenotazioni:", error);
        req.session.alert = "errore";
        req.session.message = "Errore durante il recupero di tutte le prenotazioni.";
        return res.redirect('/dashboard');
    }
});

module.exports = router