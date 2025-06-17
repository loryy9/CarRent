"use strict"
const express = require("express")
const session = require("express-session")
const passport = require("passport")
const morgan = require("morgan")
const db = require("./models/db")
const flash = require('connect-flash')
require ("dotenv").config()

const PORT = process.env.PORT || 3000

const app = express()

const indexRouter = require("./routes/index")
const registrazioneRouter = require("./routes/registrazione")
const loginRouter = require("./routes/login")
const logoutRouter = require("./routes/logout")
const utenteRouter = require("./routes/utente")
const dashboardRouter = require("./routes/dashboard")
const catalogoRouter = require("./routes/catalogo")
const autoRouter = require("./routes/auto") 
const pacchettiRouter = require("./routes/pacchetti")
const prenotazioneRouter = require("./routes/prenotazione")
const recensioniRouter = require("./routes/recensione")

app.set("view engine", "ejs")

app.use(morgan("dev"))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const isProd = process.env.NODE_ENV === 'production';
app.set('trust proxy', 1); 

app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProd,
        httpOnly: true,
        sameSite: 'lax', 
        maxAge: 1000 * 60 * 60 
    }
}))

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(passport.initialize())
app.use(passport.session())

app.use(indexRouter)
app.use(registrazioneRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(utenteRouter)
app.use(dashboardRouter)
app.use(catalogoRouter)
app.use(autoRouter)
app.use(pacchettiRouter)
app.use(prenotazioneRouter)
app.use(recensioniRouter)

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});