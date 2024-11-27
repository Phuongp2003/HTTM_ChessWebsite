const { Router } = require('express');
const { engine, restartEngine } = require('../../utils/stockfish.js');

const router = Router();
let currentFen; // Khởi tạo FEN

/**
 * @swagger
 * /api/pve/start:
 *   post:
 *     summary: Start a new PvE game
 *     description: Initializes a new PvE game with a starting FEN position.
 *     responses:
 *       200:
 *         description: Game started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fen:
 *                   type: string
 */
router.post('/start', (req, res) => {
    currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // Khởi tạo FEN
    engine.stdin.write(`setoption name UCI_LimitStrength value true\n`);
    engine.stdin.write(`setoption name UCI_Elo value 100\n`);
    res.json({ message: 'Game started', fen: currentFen });
});

/**
 * @swagger
 * /api/pve/move:
 *   post:
 *     summary: Make a move in the PvE game
 *     description: Sends a move to the engine and receives the best move in response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               move:
 *                 type: object
 *                 properties:
 *                   after:
 *                     type: string
 *     responses:
 *       200:
 *         description: Best move from the engine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bestMove:
 *                   type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/move', (req, res) => {
    const { move } = req.body;

    if (!move) {
        return res.status(400).json({ error: 'Move is required' });
    }

    try {
        // Cập nhật FEN từ thông tin nước đi
        currentFen = move.after; // Cập nhật từ FEN sau khi di chuyển
        engine.stdin.write(`position fen ${currentFen}\n`);
        engine.stdin.write('go movetime 2000\n');

        const onData = (data) => {
            const message = data.toString();
            if (message.startsWith('bestmove')) {
                const bestMove = message.split(' ')[1];
                res.json({ bestMove });
                engine.stdout.off('data', onData); // Remove the event listener after sending the response
            }
        };

        engine.stdout.on('data', onData);

        engine.on('error', (error) => {
            console.error('Engine error:', error);
            restartEngine();
        });

        engine.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Engine exited with code ${code}`);
                restartEngine();
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
