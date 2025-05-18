'use strict'
const express = require("express")
const router = express.Router()
const dao = require("../models/dao")

router.get('/recensioni', async (req, res) => {
    let recensioni = await dao.getAllRecensioni();
    res.render('recensioni', { recensioni, isAuth: req.isAuthenticated() });
})

module.exports = router