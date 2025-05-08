'use strict'
const express = require("express")
const router = express.Router()

router.get('/catalogo', (req, res) => {
    res.render('catalogo', {isAuth: req.isAuthenticated() });
})

module.exports = router