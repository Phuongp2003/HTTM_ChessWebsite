const { spawn } = require('child_process');
const { join } = require('path');

/**
 * The large multi-threaded engine:
 * This is strongest version of the engine, but it is large (≈66MB) and will only run in browsers with the proper CORS headers applied. This engine is recommended if possible.
 ** Files: stockfish-16.1.js & stockfish-16.1.wasm
 *
 * The large single-threaded engine:
 * This is also large but will run in browsers without CORS headers; however it cannot use multiple threads via the UCI command setoption name Threads. This engine is recommended if CORS support is not possible.
 ** Files: stockfish-16.1-single.js & stockfish-16.1-single.wasm
 * 
 * The lite mult-threaded engine:
 * This is the same as the first multi-threaded but much smaller (≈6MB) and quite a bit weaker. This engine is recommended for mobile browsers when CORS is available.
 ** Files: stockfish-16.1-lite.js & stockfish-16.1-lite.wasm
 * The lite single-threaded engine:
 * Same as the first single-threaded engine but much smaller (≈6MB) and quite a bit weaker. This engine is recommended for mobile browsers that do not support CORS.
 ** Files: stockfish-16.1-lite-single.js & stockfish-16.1-lite-single.wasm
 * 
 * The ASM-JS engine:
 * Compiled to JavaScript, not WASM. Compatible with every browser that runs JavaScript. Very slow and weak. Larger than the lite WASM engines (≈9MB). This engine should only be used as a last resort.
 ** File: stockfish-16.1-asm.js
 *
 */
const enginePath = join(__dirname, '..', 'node_modules', 'stockfish', 'src', 'stockfish-nnue-16.js');
const engine = spawn('node', [enginePath], { stdio: ['pipe', 'pipe', 'pipe'] });

const restartEngine = () => {
    engine.kill();
    engine = spawn('node', [enginePath], { stdio: ['pipe', 'pipe', 'pipe'] });
};

module.exports = { engine, restartEngine };
