'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao");
const { isAuth, isAdmin } = require("../middleware/auth");

const formattaData = (data) => {
    const date = new Date(data);
    const giorno = String(date.getDate()).padStart(2, '0');
    const mese = String(date.getMonth() + 1).padStart(2, '0');
    const anno = date.getFullYear();
    return `${giorno}/${mese}/${anno}`;
}

router.get('/dashboard', async (req, res) => {
    if (!isAuth(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/login');
    }

    if (isAdmin(req)) {
        return res.redirect('/dashboard/allPrenotazioni');
    }

    return res.redirect('/dashboard/prenotazioniUtente');
    
    // res.render('dashboard', { 
    //     user: req.user,
    //     view: '',
    //     isAuth: true,
    //     auto: [],
    //     preferite_user: [],
    //     pacchetti: [],
    //     prenotazioni: []
    // });
});

router.get('/dashboard/inserimentoAuto', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato ad accedere a questa sezione.");
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

router.get('/dashboard/modificaAuto/:id', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato ad accedere a questa sezione.");
        return res.redirect('/dashboard');
    }

    const auto = await dao.getAutoById(req.params.id);
    
    res.render('dashboard', { 
        user: req.user,
        view: 'modificaAuto',
        isAuth: true,
        auto,
        preferite_user: [],
        pacchetti: [],
        prenotazioni: []
    });
});

router.get('/dashboard/elencoAuto', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato ad accedere a questa sezione.");
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
        req.flash("error_msg", "Errore durante il recupero delle auto.");
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/autoPreferite', async (req, res) => {
    if (!isAuth(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
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
        req.flash("error_msg", "Errore durante il recupero delle auto preferite.");
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/elencoPacchetti', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato ad accedere a questa sezione.");
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
        req.flash("error_msg", "Errore durante il recupero dei pacchetti.");
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/inserimentoPacchetto', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato ad accedere a questa sezione.");
        return res.redirect('/dashboard');
    }
    
    res.render('dashboard', { 
        user: req.user,
        view: 'inserimentoPacchetto',
        isAuth: true,
        pacchetto: [],
        preferite_user: [],
        prenotazioni: []
    });
});

router.get('/dashboard/modificaPacchetto/:id', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Non sei autorizzato ad accedere a questa sezione.");
        return res.redirect('/dashboard');
    }

    const pacchetto = await dao.getPacchettoById(req.params.id);
    
    res.render('dashboard', { 
        user: req.user,
        view: 'modificaPacchetto',
        isAuth: true,
        preferite_user: [],
        pacchetto,
        prenotazioni: []
    });
});

router.get('/dashboard/prenotazioniUtente', async (req, res) => {
    if (!isAuth(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/login');
    }
    
    try {
        let prenotazioni = await dao.getPrenotazioniByUserId(req.user.id);
        prenotazioni.forEach((prenotazione) => {
            prenotazione.stato = dao.getStatoPrenotazione(prenotazione);
            prenotazione.data_inizio = formattaData(prenotazione.data_inizio);
            prenotazione.data_fine = formattaData(prenotazione.data_fine);            
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
        req.flash("error_msg", "Errore durante il recupero delle prenotazioni.");
        return res.redirect('/dashboard');
    }
});

router.get('/dashboard/allPrenotazioni', async (req, res) => {
    if (!isAuth(req) || !isAdmin(req)) {
        req.flash("error_msg", "Accesso non autorizzato. Effettua il login.");
        return res.redirect('/dashboard');
    }
    
    try {
        let prenotazioni = await dao.getAllPrenotazioni();
        prenotazioni.forEach((prenotazione) => {
            prenotazione.stato = dao.getStatoPrenotazione(prenotazione);
            prenotazione.data_inizio = formattaData(prenotazione.data_inizio);
            prenotazione.data_fine = formattaData(prenotazione.data_fine);   
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
        req.flash("error_msg", "Errore durante il recupero delle prenotazioni.");
        return res.redirect('/dashboard');
    }
});

module.exports = router