"use strict";

document.getElementById('prenota_button').addEventListener('click', async () => {
    const id_auto = document.getElementById('id_auto').value;
    const id_utente = document.getElementById('id_utente').value;
    const data_inizio = document.getElementById('data_inizio').value;
    const data_fine = document.getElementById('data_fine').value;
    const pacchetto = document.querySelector('input[name="pacchetto"]:checked')?.value || 0;
    const totale_giorni = document.getElementById('contatore_giorni').textContent;
    const prezzo_totale = document.getElementById('prezzo_totale').textContent.replace('€', '').replace(',', '.');

    console.log("ID Auto: " + id_auto);

    try {
        const response = await fetch('/prenotazioni/crea_prenotazione', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_auto: id_auto,
                id_utente: id_utente,
                data_inizio: data_inizio,
                data_fine: data_fine,
                pacchetto: pacchetto,
                totale_giorni: totale_giorni,
                prezzo_totale: prezzo_totale
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Prenotazione effettuata con successo!');
            window.location.href = '/catalogo';
        } else {
            alert('Errore durante la prenotazione: ' + (data.errors || 'Errore sconosciuto'));
        }  
    } catch (err) {
        console.error(err);
        alert('Errore di connessione: ' + err);
    }
})