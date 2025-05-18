'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/recensioni', async (req, res) => {
    const { alert } = req.query
    let message = '';
    if (alert === 'success') {
        message = 'Recensione aggiunta con successo.';
    } else if (alert === 'errore') {
        message = 'Errore durante l\'aggiunta della recensione.';
    }
    let recensioni = await dao.getAllRecensioni();
    res.render('recensioni', { recensioni, alert, message, isAuth: req.isAuthenticated() });
})

router.post('/recensioni/add' , async (req, res) => {   
    if (!req.isAuthenticated()) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }
    const { commento, voto } = req.body
    try {
        await dao.addRecensione(req.user.id, commento, voto);
        res.redirect('/recensioni?alert=success');
    } catch (err) {
        console.error(err);
        res.redirect('/recensioni?alert=errore');
    }
})

module.exports = router