"use strict";

function updatePriceLabels() {
    const priceMin = document.getElementById('priceMin').value;
    const priceMax = document.getElementById('priceMax').value;

    document.getElementById('priceMinLabel').textContent = priceMin;
    document.getElementById('priceMaxLabel').textContent = priceMax;
}

document.addEventListener('DOMContentLoaded', () => {
    updatePriceLabels();
});
