"use strict"
const express = require("express")
const session = require("express-session")
const passport = require("passport")
const morgan = require("morgan")

const PORT = 3000
const app = express()

// Connessione al database
const db = require("./models/db")

// Definizione del motore ejs
app.set("view engine", "ejs")

// Definizione MIDDLEWARE
app.use(morgan("tiny"))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Definizione della sessione passport
app.use(session({
    secret: "CarRent",
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

// Importazione router
const indexRouter = require("./routes/index")
const registrazioneRouter = require("./routes/registrazione")
const loginRouter = require("./routes/login")
const dashboardRouter = require("./routes/dashboard")


console.log("Router importati con successo")
app.use(indexRouter)
app.use(registrazioneRouter)
app.use(loginRouter)
app.use(dashboardRouter)


app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});