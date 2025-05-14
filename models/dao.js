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

exports.getAutoById = async (id) => {
    let sql = `SELECT * FROM auto WHERE id = ?`
    let params = [id]
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

exports.getAutoPreferite = async () => {
    let sql = `SELECT * FROM auto ORDER BY pref_contatore DESC LIMIT 3`
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

exports.updateAuto = async (id, auto) => {
    const sql = `
        UPDATE auto
        SET marca = ?, modello = ?, tipologia = ?, velocita = ?, cavalli = ?, prezzo_giornaliero = ?
        WHERE id = ?
    `;
    const params = [
        auto.marca, 
        auto.modello, 
        auto.tipologia, 
        auto.velocita, 
        auto.cavalli, 
        auto.prezzo_giornaliero, 
        id
    ];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.deleteAuto = async (id) => {
    let sql = `DELETE FROM auto WHERE id = ?`
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

exports.isAutoPreferita = async (id_auto, id_utente) => {
    let sql = 'SELECT * FROM preferite WHERE id_auto = ? AND id_utente = ?';
    let params = [id_auto, id_utente];

    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if(err){
                reject(err);
            }
            else{
                resolve(row);
            }
        })
    })
}

exports.addAutoPreferita = async (id_auto, id_utente) => {
    let sql = 'INSERT INTO preferite (id_auto, id_utente) VALUES (?, ?)';
    let params = [id_auto, id_utente];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(this.lastID);
            }
        })
    })
}

exports.incrementaContatorePreferite = async (id_auto) => {
    let sql = 'UPDATE auto SET pref_contatore = pref_contatore + 1 WHERE id = ?';
    let params = [id_auto];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(this.changes);
            }
        })
    })
}

exports.removePreferita = async (id_auto, id_utente) => {
    let sql = 'DELETE FROM preferite WHERE id_auto = ? AND id_utente = ?';
    let params = [id_auto, id_utente];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(this.changes);
            }
        })
    })
}

exports.decrementaContatorePreferite = async (id_auto) => {
    let sql = 'UPDATE auto SET pref_contatore = pref_contatore - 1 WHERE id = ?';
    let params = [id_auto];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(this.changes);
            }
        })
    })
}

exports.getPreferiteByUserId = async (id_utente) => {
    let sql = `
        select id_auto
        from preferite
        where id_utente = ?
    `;
    let params = [id_utente];

    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        })
    })
}

exports.getAllPacchetti = async () => {
    let sql = 'SELECT * FROM pacchetti_aggiuntivi ORDER BY categoria ASC, prezzo ASC';
    
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            } else {
                resolve(rows)
            }            
        })
    })
}

exports.getCategoriaPacchetti = async () => {
    let sql = 'SELECT DISTINCT categoria FROM pacchetti_aggiuntivi ORDER BY categoria ASC';
    
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            } else {
                resolve(rows)
            }            
        })
    })
}

exports.newPacchetto = async (pacchetto) => {
    let sql = `INSERT INTO pacchetti_aggiuntivi (categoria, nome, descrizione, prezzo)
               VALUES (?, ?, ?, ?)`;
    let params = [pacchetto.categoria, pacchetto.nome, pacchetto.descrizione, pacchetto.prezzo] 
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

exports.deletePacchetto = async (id) => {
    let sql = `DELETE FROM pacchetti_aggiuntivi WHERE id = ?`
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