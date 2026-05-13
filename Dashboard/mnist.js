const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;
const NUM_TRAIN_ELEMENTS = 55000;
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;
const CHUNK_SIZE = 5000;

const IMAGES_URL = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const LABELS_URL = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

export class MnistData {
    async load() {
        const [images, labelsBuffer] = await Promise.all([
            this._loadImages(),
            fetch(LABELS_URL).then(r => r.arrayBuffer())
        ]);
        this.images = images;
        this.labels = new Uint8Array(labelsBuffer);
    }

    _loadImages() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = '';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = CHUNK_SIZE;

                const buffer = new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

                for (let i = 0; i < NUM_DATASET_ELEMENTS / CHUNK_SIZE; i++) {
                    const view = new Float32Array(buffer, i * IMAGE_SIZE * CHUNK_SIZE * 4, IMAGE_SIZE * CHUNK_SIZE);
                    ctx.drawImage(img, 0, i * CHUNK_SIZE, img.width, CHUNK_SIZE, 0, 0, img.width, CHUNK_SIZE);
                    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    for (let j = 0; j < pixels.data.length / 4; j++) {
                        view[j] = pixels.data[j * 4] / 255;
                    }
                }
                resolve(new Float32Array(buffer));
            };
            img.onerror = reject;
            img.src = IMAGES_URL;
        });
    }

    getTrainData() {
        return this._slice(0, NUM_TRAIN_ELEMENTS);
    }

    getTestData() {
        return this._slice(NUM_TRAIN_ELEMENTS, NUM_TEST_ELEMENTS);
    }

    _slice(offset, count) {
        const xs = tf.tensor2d(
            new Float32Array(this.images.buffer, offset * IMAGE_SIZE * 4, IMAGE_SIZE * count),
            [count, IMAGE_SIZE]
        );
        const ys = tf.tensor2d(
            new Float32Array(new Uint8Array(this.labels.buffer, offset * NUM_CLASSES, NUM_CLASSES * count)),
            [count, NUM_CLASSES]
        );
        return { xs, ys };
    }
}
