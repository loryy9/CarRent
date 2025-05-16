'use strict'
const express = require('express')
const router = express.Router()
const dao = require("../models/dao")
const { check, validationResult } = require("express-validator")


router.post("/prenotazioni/controllo_disponibilita", [
    check("data_inizio").notEmpty(),
    check("data_fine").notEmpty(),
    check("id_auto").notEmpty()
], async (req, res) => {    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() })
    }
    try{
        const { data_inizio, data_fine, id_auto } = req.body
        const disponibile = await dao.verificaDisponibilita(data_inizio, data_fine, id_auto)
        return res.json({ success: true, disponibile: disponibile })
    } catch (err) {
        console.error(err)
        return res.json({ success: false, errors: "errore_query" })
    }
})

module.exports = router