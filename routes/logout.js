"use strict";

const express = require('express');
const passport = require('passport');   
const router = express.Router();

router.get('/logout', (req, res) => {   
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err){
                console.error('Errore durante il logout:', err);
                return next(err);
            }
            res.redirect('/login?alert=logout')
        });
    }
    else{
        res.redirect('/login?alert=errore&errorType=logout');
    }
})

module.exports = router;