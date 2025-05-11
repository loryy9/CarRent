'use strict'
const express = require("express")
const router = express.Router()

router.get('/dashboard', (req, res) => {
    const { alert } = req.query;
    if(!req.isAuthenticated()) {
        return res.redirect('/login?alert=errore&errorType=non_autorizzato');
    }
    let message = '';
    if (alert === 'cancellazione'){
        message = 'Utente cancellato con successo.';
    }
    let view = '';
    if (alert === 'inserimentoAuto'){
        view = 'inserimentoAuto';
    }

    res.render('dashboard', {user: req.user, alert, message, view, isAuth: req.isAuthenticated()});
});

module.exports = router