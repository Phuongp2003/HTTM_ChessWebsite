import * as tf from '@tensorflow/tfjs-node';
import '@tensorflow/tfjs-node';

console.log(tf.backend().isBackend('tensorflow') ? 'Using GPU' : 'Not using GPU');
