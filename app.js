"use strict"
const express = require("express")
const session = require("express-session")
const passport = require("passport")
const morgan = require("morgan")
const db = require("./models/db")

const PORT = 3000
const app = express()

const indexRouter = require("./routes/index")
const registrazioneRouter = require("./routes/registrazione")
const loginRouter = require("./routes/login")
const logoutRouter = require("./routes/logout")
const cancellaUtenteRouter = require("./routes/cancellaUtente")
const dashboardRouter = require("./routes/dashboard")
const catalogoRouter = require("./routes/catalogo")
const autoRouter = require("./routes/auto") 
const pacchettiRouter = require("./routes/pacchetti")

app.set("view engine", "ejs")

app.use(morgan("tiny"))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: "CarRent",
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(indexRouter)
app.use(registrazioneRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(cancellaUtenteRouter)
app.use(dashboardRouter)
app.use(catalogoRouter)
app.use(autoRouter)
app.use(pacchettiRouter)

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});