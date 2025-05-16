document.getElementById('verifica_disponibilita').addEventListener('click', async () => {
    const data_inizio = document.getElementById('data_inizio').value;
    const data_fine = document.getElementById('data_fine').value;
    const id_auto = document.getElementById('id_auto').value;
    const alertDiv = document.getElementById('disponibilita_alert');
    const prenotaButton = document.getElementById('prenota_button');

    alertDiv.style.display = 'none';

    try {
        const response = await fetch('/prenotazioni/controllo_disponibilita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_auto: id_auto,
                data_inizio: data_inizio, 
                data_fine: data_fine
            })
        });

        const data = await response.json();
        
        if (data.success) {
            if (data.disponibile) {
                alertDiv.className = 'alert alert-success';
                alertDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i> Auto disponibile per il periodo selezionato!';
                prenotaButton.disabled = false;
            } else {
                alertDiv.className = 'alert alert-danger';
                alertDiv.innerHTML = '<i class="fas fa-times-circle me-2"></i> Auto non disponibile per il periodo selezionato. Prova altre date.';
                prenotaButton.disabled = true;
            }
        } else {
            alertDiv.className = 'alert alert-danger';
            alertDiv.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> ' + (data.errors || 'Errore durante la verifica');
            prenotaButton.disabled = true;
        }
        
        alertDiv.style.display = 'block';
    } catch (err) {
        console.error(err);
        alertDiv.className = 'alert alert-danger';
        alertDiv.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> Errore di connessione';
        alertDiv.style.display = 'block';
        prenotaButton.disabled = true;
    }
});