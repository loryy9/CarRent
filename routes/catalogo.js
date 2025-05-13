'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/catalogo', async (req, res) => {
    let auto = await dao.getAllAuto();
    res.render('catalogo', {auto, isAuth: req.isAuthenticated(), user: req.user || {ruolo: 0}});
})

module.exports = router