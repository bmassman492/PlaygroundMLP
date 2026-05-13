const WEIGHT_INIT = {
    'xavier-uniform': 'glorotUniform',
    'xavier-normal':  'glorotNormal',
    'he-uniform':     'heUniform',
    'random-uniform': 'randomUniform',
    'zero':           'zeros'
};

function getBiasInit(key) {
    if (key === 'constant')      return tf.initializers.constant({ value: 0.01 });
    if (key === 'random-uniform') return 'randomUniform';
    return 'zeros';
}

function addLayer(model, units, activation, kernelInit, biasInit, inputShape = null) {
    const config = { units, kernelInitializer: kernelInit, biasInitializer: biasInit };
    if (inputShape) config.inputShape = inputShape;
    if (activation !== 'leaky-relu') config.activation = activation;
    model.add(tf.layers.dense(config));
    if (activation === 'leaky-relu') model.add(tf.layers.leakyReLU({ alpha: 0.01 }));
}

export async function trainAndTest(hyperparams, trainData, testData, onProgress) {
    const { hiddenLayers, nodesPerLayer, learningRate, batchSize, epochs, weightInit, biasInit, activation } = hyperparams;

    const kernelInit = WEIGHT_INIT[weightInit];
    const biasInitializer = getBiasInit(biasInit);

    const model = tf.sequential();

    addLayer(model, nodesPerLayer[0], activation, kernelInit, biasInitializer, [784]);
    for (let i = 1; i < hiddenLayers; i++) {
        addLayer(model, nodesPerLayer[i], activation, kernelInit, biasInitializer);
    }
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    await model.fit(trainData.xs, trainData.ys, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (onProgress) onProgress(epoch + 1, epochs, logs.loss.toFixed(4));
            }
        }
    });

    const [lossTensor, accTensor] = model.evaluate(testData.xs, testData.ys);
    const accuracy = (await accTensor.data())[0];

    model.dispose();
    tf.dispose([trainData.xs, trainData.ys, testData.xs, testData.ys, lossTensor, accTensor]);

    return (accuracy * 100).toFixed(2);
}
