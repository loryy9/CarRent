"use strict"
const express = require("express")
const morgan = require("morgan")

const PORT = 3000
const app = express()
const db = require("./models/db")

app.use(morgan("tiny"))
app.use(express.static('public'))
app.use(express.json())

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render('home'); // 'home' senza estensione .ejs
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});