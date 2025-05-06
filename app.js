"use strict"

const express = require("express")
const sqlite = require("sqlite3")
const morgan = require("morgan")

const PORT = 3000
const NOME_DB = "CarRent.db"

const app = express()

app.use(morgan("tiny"))
app.use(express.static('public'))
app.use(express.json)

const db = new sqlite.Database('database/' + NOME_DB, (err) => {
    if (err) {
        console.log('Errore nella connessione: ', err.message);
    } else {
        console.log('Connesso al database ' + NOME_DB);
    }
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});