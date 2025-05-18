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
    let sql = `INSERT INTO auto (marca, modello, immagine, disponibile, velocita, cavalli, tipologia, pref_contatore, prezzo_giornaliero, carburante)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let params = [
        auto.marca,
        auto.modello,
        auto.immagine,
        1,
        auto.velocita,
        auto.cavalli,
        auto.tipologia,
        0,
        auto.prezzo_giornaliero,
        auto.carburante
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
        SET marca = ?, modello = ?, tipologia = ?, velocita = ?, cavalli = ?, prezzo_giornaliero = ?, carburante = ?
        WHERE id = ?
    `;
    const params = [
        auto.marca, 
        auto.modello, 
        auto.tipologia, 
        auto.velocita, 
        auto.cavalli, 
        auto.prezzo_giornaliero, 
        auto.carburante,
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

exports.getPacchettoById = async (id) => {
    let sql = `SELECT * FROM pacchetti_aggiuntivi WHERE id = ?`
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

exports.getAllPacchetti = async () => {
    let sql = 'SELECT * FROM pacchetti_aggiuntivi ORDER BY prezzo ASC';
    
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
    let sql = `INSERT INTO pacchetti_aggiuntivi (nome, descrizione, prezzo)
               VALUES (?, ?, ?)`;
    let params = [pacchetto.nome, pacchetto.descrizione, pacchetto.prezzo] 
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

exports.updatePacchetto = async (id, pacchetto) => {
    const sql = `
        UPDATE pacchetti_aggiuntivi
        SET nome = ?, descrizione = ?, prezzo = ?
        WHERE id = ?
    `;
    const params = [ 
        pacchetto.nome, 
        pacchetto.descrizione, 
        pacchetto.prezzo, 
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
}

exports.verificaDisponibilita = async (data_inizio_check, data_fine_check, id_auto) => {
    let sql = 'SELECT * FROM prenotazioni WHERE id_auto = ? AND (data_inizio <= ? AND data_fine >= ?)';
    let params = [id_auto, data_fine_check, data_inizio_check];

    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.length === 0);
            }
        });
    });
}

exports.creaPrenotazione = async (id_auto, id_utente, data_inizio, data_fine, pacchetto, totale_giorni, prezzo_totale) => {
    let sql = `INSERT INTO prenotazioni (id_utente, id_auto, data_inizio, data_fine, totale_giorni, prezzo_totale, id_pacchetto) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`
    let params = [
        id_utente,
        id_auto,
        data_inizio,
        data_fine,
        totale_giorni,
        prezzo_totale,
        pacchetto
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

exports.getAllPrenotazioni = async () => {
    let sql = `SELECT p.*, a.marca, a.modello, pa.nome AS nome_pacchetto, u.email AS email_utente
               FROM prenotazioni p
               JOIN auto a ON p.id_auto = a.id
               JOIN utenti u ON p.id_utente = u.id
               LEFT JOIN pacchetti_aggiuntivi pa ON p.id_pacchetto = pa.id
               ORDER BY p.id DESC`;
    
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            } else{
                resolve(rows);
            }
        })
    })
}

exports.getPrenotazioniByUserId = async (id_utente) => {
    let sql = `SELECT p.*, a.marca, a.modello, pa.nome AS nome_pacchetto
               FROM prenotazioni p
               JOIN auto a ON p.id_auto = a.id
               LEFT JOIN pacchetti_aggiuntivi pa ON p.id_pacchetto = pa.id
               WHERE p.id_utente = ?
               ORDER BY p.id DESC`;

    let params = [id_utente];
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if(err){
                reject(err);
            } else{
                resolve(rows);
            }
        })
    })
}

exports.getStatoPrenotazione = (prenotazione) => {
    const oggi = new Date();
    const data_inizio = new Date(prenotazione.data_inizio);
    const data_fine = new Date(prenotazione.data_fine);

    const oggiSoloData = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
    const dataInizioSoloData = new Date(data_inizio.getFullYear(), data_inizio.getMonth(), data_inizio.getDate());
    const dataFineSoloData = new Date(data_fine.getFullYear(), data_fine.getMonth(), data_fine.getDate());

    if (oggiSoloData < dataInizioSoloData) {
        return 'In attesa';
    } else if (oggiSoloData >= dataInizioSoloData && oggiSoloData <= dataFineSoloData) {
        return 'In corso';
    } else if (oggiSoloData > dataFineSoloData) {
        return 'Conclusa';
    } else {
        return 'Sconosciuto';
    }
};

exports.deletePrenotazione = async (id) => {
    let sql = `DELETE FROM prenotazioni WHERE id = ?`
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

exports.getRecensioniHome = async () => {
    let sql = `SELECT r.*, u.nome, u.cognome
               FROM recensioni r
               JOIN utenti u ON r.id_utente = u.id
               LIMIT 3`
    
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            } else{
                resolve(rows);
            }
        })
    })            
}

exports.getAllRecensioni = async () => {
    let sql = `SELECT r.*, u.nome, u.cognome
               FROM recensioni r
               JOIN utenti u ON r.id_utente = u.id`
    
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            } else{
                resolve(rows);
            }
        })
    })            
}

exports.addRecensione = async (id_utente, commento, voto) => {
    let sql = `INSERT INTO recensioni (id_utente, commento, voto) 
                VALUES (?, ?, ?)`
    let params = [id_utente, commento, voto]

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