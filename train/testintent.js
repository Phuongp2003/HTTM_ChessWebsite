import * as tf from '@tensorflow/tfjs';
import * as tfn from '@tensorflow/tfjs-node';
import { readFileSync } from 'fs';
import path from 'path';
// Load the model architecture and weights
async function loadModel() {
    const handler = tfn.io.fileSystem("./model/model.json");
    const model = await tf.loadLayersModel(handler);
    return model;
}

// Read tokenizer and label map
const tokenizer = JSON.parse(readFileSync('tokenizer.json', 'utf8'));
const labelMap = JSON.parse(readFileSync('label_map.json', 'utf8'));
const reversedLabelMap = Object.keys(labelMap).reduce((acc, key) => {
    acc[labelMap[key]] = key;
    return acc;
}, {});

// Predict function
async function predict(fen, move) {
    const model = await loadModel();
    const input = `${fen} ${move}`;
    const tokens = tokenizer.texts_to_sequences([input]);
    const inputTensor = tf.tensor2d(tokens, [1, tokens[0].length]);

    const predictions = model.predict(inputTensor);
    const intentIndex = predictions.argMax(1).dataSync()[0];

    return reversedLabelMap[intentIndex];
}

// Example usage
predict('rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R w KQkq - 0 1', 'e2e4').then(intent => {
    console.log('Intent:', intent);
});
