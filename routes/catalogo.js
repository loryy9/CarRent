'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/catalogo', async (req, res) => {
    let preferite_user = []
    if (req.user) {
        preferite_user = await dao.getPreferiteByUserId(req.user.id);
    }
    let auto = await dao.getAllAuto();
    res.render('catalogo', {auto, preferite_user, isAuth: req.isAuthenticated(), user: req.user || {ruolo: 0}});
})

module.exports = router