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

router.post("/prenotazioni/crea_prenotazione", [
    check("id_auto").notEmpty(),
    check("id_utente").notEmpty(),
    check("data_inizio").notEmpty(),
    check("data_fine").notEmpty(),
    check("pacchetto").notEmpty(),
    check("totale_giorni").notEmpty(),
    check("prezzo_totale").notEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log("Errori di validazione:", errors.array())
        return res.json({ success: false, errors: errors.array() })
    }
    try{
        console.log("ID Auto: " + req.body.id_auto)
        const { id_auto, id_utente, data_inizio, data_fine, pacchetto, totale_giorni, prezzo_totale } = req.body
        await dao.creaPrenotazione(id_auto, id_utente, data_inizio, data_fine, pacchetto, totale_giorni, prezzo_totale)
        console.log("===================Prenotazione effettuata con successo")
        return res.json({ success: true })
    } catch (err) {
        console.error(err)
        return res.json({ success: false, errors: "errore_query" })
    }
})

module.exports = router