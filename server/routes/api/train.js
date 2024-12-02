const { Router } = require('express');
const { engine, restartEngine } = require('../../utils/stockfish.js');

const router = Router();

/**
 * @swagger
 * /api/train/start:
 *   post:
 *     summary: Start training with the chess engine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fen:
 *                 type: string
 *                 description: The FEN string of the chess position
 *               role:
 *                 type: string
 *                 enum: [white, black]
 *                 description: The role of the player
 *               elo:
 *                 type: integer
 *                 description: The ELO rating of the player
 *               coachEloMultiple:
 *                 type: number
 *                 description: The multiple of the coach's ELO rating
 *     responses:
 *       200:
 *         description: Training started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fen:
 *                   type: string
 *                 bestMove:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/start', async (req, res) => {
    const { fen, role, elo, coachEloMultiple } = req.body;

    if (!role || !elo) {
        return res.status(400).json({ error: 'Role and elo are required' });
    }
    if (!coachEloMultiple) coachEloMultiple = 1;

    const currentFen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    engine.stdin.write(`setoption name UCI_LimitStrength value true\n`);
    engine.stdin.write(`setoption name UCI_Elo value ${Math.round(elo * coachEloMultiple)}\n`);

    const botColor = role === 'white' ? 'w' : 'b';
    const fenParts = currentFen.split(' ');
    const nextTurn = fenParts[1];
    let bestMove;

    if (nextTurn === botColor) {
        engine.stdin.write(`position fen ${currentFen}\n`);
        engine.stdin.write('go movetime 2000\n');

        const onData = (data) => {
            const message = data.toString();
            if (message.startsWith('bestmove')) {
                bestMove = message.split(' ')[1];
                engine.stdout.off('data', onData);
                res.json({ message: 'Training started', fen: currentFen, bestMove });
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
    } else
        res.json({ message: 'Training started', fen: currentFen });
});


/**
 * @swagger
 * /api/train/move:
 *   post:
 *     summary: Make a move in the chess engine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               move:
 *                 type: string
 *                 description: The move to make
 *               fen:
 *                 type: string
 *                 description: The FEN string of the chess position
 *     responses:
 *       200:
 *         description: Best move calculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bestMove:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/move', (req, res) => {
    const { move, fen, elo, coachEloMultiple } = req.body;

    if (!move || !fen || !elo) {
        return res.status(400).json({ error: 'Move, FEN and elo is required' });
    }

    try {
        if (!coachEloMultiple) coachEloMultiple = 1;
        engine.stdin.write(`setoption name UCI_LimitStrength value true\n`);
        engine.stdin.write(`setoption name UCI_Elo value ${Math.round(elo * coachEloMultiple)}\n`);
        engine.stdin.write(`position fen ${fen}\n`);
        engine.stdin.write('go movetime 2000\n');

        const onData = (data) => {
            const message = data.toString();
            if (message.startsWith('bestmove')) {
                const bestMove = message.split(' ')[1];
                res.json({ bestMove });
                engine.stdout.off('data', onData);
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
