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

exports.newAuto = async (auto) => {
    let sql = `INSERT INTO auto (marca, modello, immagine, disponibile, velocita, cavalli, tipologia, pref_contatore, prezzo_giornaliero)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let params = [
        auto.marca,
        auto.modello,
        auto.immagine,
        1,
        auto.velocita,
        auto.cavalli,
        auto.tipologia,
        0,
        auto.prezzo_giornaliero
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

exports.getAllAuto = async () => {
    let sql = `SELECT * FROM auto`;
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};