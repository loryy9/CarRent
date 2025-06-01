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
                let auto = rows.map((a) => (
                    {
                        id: a.id,
                        marca: a.marca,
                        modello: a.modello,
                        immagine: a.immagine,
                        disponibile: a.disponibile === 1,
                        velocita: a.velocita,
                        cavalli: a.cavalli,
                        tipologia: a.tipologia,
                        pref_contatore: a.pref_contatore,
                        prezzo_giornaliero: a.prezzo_giornaliero,
                        carburante: a.carburante
                    }
                ));
                resolve(auto);
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
                resolve({
                    id: row.id,
                    marca: row.marca,
                    modello: row.modello,
                    immagine: row.immagine,
                    disponibile: row.disponibile === 1,
                    velocita: row.velocita,
                    cavalli: row.cavalli,
                    tipologia: row.tipologia,
                    pref_contatore: row.pref_contatore,
                    prezzo_giornaliero: row.prezzo_giornaliero,
                    carburante: row.carburante
                })
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
                let auto = rows.map((a) => (
                    {
                        id: a.id,
                        marca: a.marca,
                        modello: a.modello,
                        immagine: a.immagine,
                        disponibile: a.disponibile === 1,
                        velocita: a.velocita,
                        cavalli: a.cavalli,
                        tipologia: a.tipologia,
                        pref_contatore: a.pref_contatore,
                        prezzo_giornaliero: a.prezzo_giornaliero,
                        carburante: a.carburante
                    }
                ));
                resolve(auto);
            }
        })
    })
}

exports.updateAuto = async (id, auto, immagine) => {
    const sql = `
        UPDATE auto
        SET marca = ?, modello = ?, immagine = ?, tipologia = ?, velocita = ?, cavalli = ?, prezzo_giornaliero = ?, carburante = ?
        WHERE id = ?
    `;
    const params = [
        auto.marca, 
        auto.modello, 
        immagine,
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

exports.getMarchi = async () => {
    let sql = `SELECT DISTINCT marca FROM auto ORDER BY marca ASC`;
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            } else{
                const marchi = rows.map((row) => (
                    {
                        marca: row.marca
                    }
                ));
                resolve(marchi);
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
                resolve(row ? true : false);
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
                let auto = rows.map((a) => (
                    {
                        id_auto: a.id_auto,
                        marca: a.marca,
                        modello: a.modello,
                        immagine: a.immagine,
                        disponibile: a.disponibile === 1,
                        velocita: a.velocita,
                        cavalli: a.cavalli,
                        tipologia: a.tipologia,
                        pref_contatore: a.pref_contatore,
                        prezzo_giornaliero: a.prezzo_giornaliero,
                        carburante: a.carburante
                    }
                ));
                resolve(auto);
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
                resolve({
                    id: row.id,
                    nome: row.nome,
                    descrizione: row.descrizione,
                    prezzo: row.prezzo
                })
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
                let pacchetti = rows.map((p) => (
                    {
                        id: p.id,
                        nome: p.nome,
                        descrizione: p.descrizione,
                        prezzo: p.prezzo
                    }
                ));
                resolve(pacchetti)
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
                let prenotazioni = rows.map((p) => (
                    {
                        id: p.id,
                        id_utente: p.id_utente,                        
                        id_auto: p.id_auto,
                        data_inizio: p.data_inizio,
                        data_fine: p.data_fine,
                        totale_giorni: p.totale_giorni,
                        prezzo_totale: p.prezzo_totale,
                        id_pacchetto: p.id_pacchetto,
                        data_creazione: p.data_creazione,
                        marca: p.marca,
                        modello: p.modello,
                        nome_pacchetto: p.nome_pacchetto,
                        email_utente: p.email_utente
                    }
                ));
                resolve(prenotazioni);
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
                let prenotazioni = rows.map((p) => (
                    {
                        id: p.id,
                        id_utente: p.id_utente,
                        id_auto: p.id_auto,
                        data_inizio: p.data_inizio,
                        data_fine: p.data_fine,
                        totale_giorni: p.totale_giorni,
                        prezzo_totale: p.prezzo_totale,
                        id_pacchetto: p.id_pacchetto,
                        data_creazione: p.data_creazione,
                        marca: p.marca,
                        modello: p.modello,
                        nome_pacchetto: p.nome_pacchetto 
                    }
                ));
                resolve(prenotazioni);
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
                let recensioni = rows.map((r) => (
                    {
                        id: r.id,
                        id_utente: r.id_utente,
                        voto: r.voto,
                        commento: r.commento,
                        data: r.data
                    }
                ));
                resolve(recensioni);
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
                let recensioni = rows.map((r) => (
                    {
                        id: r.id,
                        id_utente: r.id_utente,
                        nome: r.nome,
                        cognome: r.cognome,
                        voto: r.voto,
                        commento: r.commento,
                        data: r.data
                    }
                ));
                resolve(recensioni);
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