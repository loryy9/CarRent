'use strict'
const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', { isAuth: req.isAuthenticated() });
});

module.exports = router