"use strict";

const express = require('express');
const passport = require('passport');
const { isAuth } = require('../public/js/auth');
const router = express.Router();

router.get('/logout', (req, res) => {
    if (!isAuth(req)) {
        return res.redirect('/login?alert=errore&errorType=logout');
    }
    req.logout((err) => {
        if (err) {
            console.error('Errore durante il logout:', err);
            return next(err);
        }
        res.redirect('/login?alert=logout')
    });

})

module.exports = router;