'use strict'
const express = require("express")
const router = express.Router()

router.get('/dashboard', (req, res) => {
    res.render('dasboard');
});

module.exports = router