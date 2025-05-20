"use strict";

document.addEventListener('DOMContentLoaded', () => {

    const dataInizio = document.getElementById('data_inizio');
    const dataFine = document.getElementById('data_fine');
    const prezzoAuto = parseFloat(document.getElementById('prezzo_auto').textContent.replace('€', ''));
    const prezzoPacchetto = document.getElementById('prezzo_pacchetto');
    const contatore_giorni = document.getElementById('contatore_giorni');
    const prezzoTotale = document.getElementById('prezzo_totale');

    const forzaturaDataOdierna = new Date();

    dataInizio.valueAsDate = forzaturaDataOdierna;
    dataFine.valueAsDate = forzaturaDataOdierna;
    dataInizio.addEventListener('change', aggiornaTotale);
    dataFine.addEventListener('change', aggiornaTotale);

    document.querySelectorAll('input[name="pacchetto"]').forEach(radio => {
        radio.addEventListener('change', aggiornaTotale);
    });

    function calcolaGiorni() {
        const inizio = new Date(dataInizio.value);
        const fine = new Date(dataFine.value);
        const differenza = fine - inizio;
        const millisecondiInUnGiorno = 1000 * 60 * 60 * 24;
        const giorni = Math.max(0, Math.ceil(differenza / millisecondiInUnGiorno));  //utilizzo ceil per arrotondare in eccesso
        return giorni + 1;
    }

    function aggiornaTotale() {
        const giorni = calcolaGiorni();
        contatore_giorni.textContent = giorni;

        const pacchettoSelezionato = document.querySelector('input[name="pacchetto"]:checked');
        let prezzoPacchettoGiornaliero = 0;
        if (pacchettoSelezionato) {
            prezzoPacchettoGiornaliero = parseFloat(pacchettoSelezionato.dataset.prezzo);  //in prenotazione.ejs passo data-prezzo
        }
        prezzoPacchetto.textContent = `€${prezzoPacchettoGiornaliero.toFixed(2)}`;

        const totale = giorni * (prezzoAuto + prezzoPacchettoGiornaliero);
        prezzoTotale.textContent = `€${totale.toFixed(2)}`;
    }

    aggiornaTotale();
});
