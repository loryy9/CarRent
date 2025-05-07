'use strict'
const { response } = require("express")
const bcrypt = require("bcrypt")
const sqlite = require("sqlite3")
const db = require("./db")

exports.newUser = async (user, cryptPwd) => {
    sql = `INSERT INTO utenti (nome, cognome, email, password, data_nascita, telefono, patente_posseduta, numero_patente, data_scadenza_patente, ruolo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    params = [
        user.nome,
        user.cognome,
        user.email,
        cryptPwd,
        user.data_nascita,
        user.telefono,
        user.patente_posseduta,
        user.numero_patente ? user.numero_patente : null,
        user.data_scadenza_patente ? user.data_scadenza_patente : null,
        0 // 0 = cliente, 1 = admin
    ]

    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err){
            if (err) {
                reject(err)
            } else {
                resolve({id: this.lastID});
            }
        })
    })    
}