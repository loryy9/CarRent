'use strict'
const { response } = require("express")
const bcrypt = require("bcrypt")
const sqlite = require("sqlite3")
const db = require("./db")

exports.newUser = async (user, cryptPwd) => {
    let sql = `INSERT INTO utenti (nome, cognome, email, password, data_nascita, telefono, ruolo) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`
    let params = [
        user.nome,
        user.cognome,
        user.email,
        cryptPwd,
        user.data_nascita,
        user.telefono,
        0
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

exports.deleteUser = async (id) => {
    let sql = `DELETE FROM utenti WHERE id = ?`
    let params = [id]

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