import { MnistData } from './mnist.js';
import { trainAndTest } from './network.js';

document.addEventListener('DOMContentLoaded', function() {
    const layersInput = document.getElementById('hidden-layers-input');
    const container = document.getElementById('layer-nodes-container');

    function clampInput(input) {
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        let val = parseFloat(input.value);
        if (isNaN(val)) return;
        if (val < min) input.value = min;
        else if (val > max) input.value = max;
    }

    function updateLayerRows() {
        const count = Math.min(10, Math.max(1, parseInt(layersInput.value) || 1));
        const existing = container.querySelectorAll('.layer-node-row');

        for (let i = existing.length + 1; i <= count; i++) {
            const p = document.createElement('p');
            p.className = 'hyperparameter layer-node-row';
            p.innerHTML = `Number of nodes in layer ${i}: <input type="number" min="1" max="1000" value="100">`;
            const newInput = p.querySelector('input');
            newInput.addEventListener('change', () => clampInput(newInput));
            container.appendChild(p);
        }

        const rows = container.querySelectorAll('.layer-node-row');
        for (let i = rows.length; i > count; i--) {
            rows[i - 1].remove();
        }
    }

    ['hidden-layers-input', 'learning-rate-input', 'batch-size-input', 'epochs-input'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('change', () => clampInput(input));
    });

    layersInput.addEventListener('input', updateLayerRows);
    updateLayerRows();

    function collectHyperparams() {
        return {
            hiddenLayers:  parseInt(document.getElementById('hidden-layers-input').value),
            nodesPerLayer: [...document.querySelectorAll('.layer-node-row input')].map(i => parseInt(i.value)),
            learningRate:  parseFloat(document.getElementById('learning-rate-input').value),
            batchSize:     parseInt(document.getElementById('batch-size-input').value),
            epochs:        parseInt(document.getElementById('epochs-input').value),
            weightInit:    document.getElementById('weight-init-select').value,
            biasInit:      document.getElementById('bias-init-select').value,
            activation:    document.getElementById('activation-select').value
        };
    }

    document.getElementById('train-button').addEventListener('click', async () => {
        const statusText = document.getElementById('accuracy-text');
        const button = document.getElementById('train-button');
        button.disabled = true;

        statusText.textContent = 'Loading MNIST data...';
        const data = new MnistData();
        await data.load();

        statusText.textContent = 'Training model... epoch 0/' + document.getElementById('epochs-input').value;
        const accuracy = await trainAndTest(
            collectHyperparams(),
            data.getTrainData(),
            data.getTestData(),
            (epoch, total, loss) => {
                statusText.textContent = `Training model... epoch ${epoch}/${total}  (loss: ${loss})`;
            }
        );

        statusText.textContent = `Test accuracy: ${accuracy}%`;
        button.disabled = false;
    });

});