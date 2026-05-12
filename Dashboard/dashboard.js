document.addEventListener('DOMContentLoaded', function() {
    const layersInput = document.getElementById('hidden-layers-input');
    const container = document.getElementById('layer-nodes-container');

    function updateLayerRows() {
        const count = Math.min(10, Math.max(1, parseInt(layersInput.value) || 1));
        const existing = container.querySelectorAll('.layer-node-row');

        for (let i = existing.length + 1; i <= count; i++) {
            const p = document.createElement('p');
            p.className = 'hyperparameter layer-node-row';
            p.innerHTML = `Number of nodes in layer ${i}: <input type="number" min="1" max="1000" value="100">`;
            container.appendChild(p);
        }

        const rows = container.querySelectorAll('.layer-node-row');
        for (let i = rows.length; i > count; i--) {
            rows[i - 1].remove();
        }
    }

    layersInput.addEventListener('input', updateLayerRows);
    updateLayerRows();

});