const { Router } = require('express');
const { getIo } = require('../../socket/index.js');
const { matches } = require('@database/index.js');

const router = Router();

/**
 * @swagger
 * /api/pvp/start:
 *   post:
 *     summary: Start a new PvP game
 *     description: Initializes a new PvP game with a starting FEN position.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *                 description: The ID of the game
 *               playerId:
 *                 type: string
 *                 description: The ID of the player starting the game
 *               playerColor:
 *                 type: string
 *                 description: The color of the player starting the game
 *     responses:
 *       200:
 *         description: Game started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                 playerColor:
 *                   type: string
 *                 message:
 *                   type: string
 *                 fen:
 *                   type: string
 *       403:
 *         description: Only the white player can start the game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/start', async (req, res) => {
    const { gameId, playerId, playerColor } = req.body;
    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    // Fetch the game state to verify the player
    const gameState = await matches.getMatchById(gameId);

    if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
    }

    // Check if the player is the white player
    if (gameState.white_player !== playerId) {
        return res.status(403).json({ error: 'Only the white player can start the game' });
    }

    await matches.updateMatchFenAndHistory(gameId, initialFen, []);

    const io = getIo();
    io.to(gameId.toString()).emit('game_started', { gameId, playerColor });

    res.json({ gameId, playerColor, message: 'Game started', fen: initialFen });
});

// PvP - Nhận nước đi
/**
 * @swagger
 * /api/pvp/move:
 *   post:
 *     summary: Make a move in a PvP game
 *     description: Records a move in the game and updates the FEN position.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matchId:
 *                 type: string
 *                 description: The ID of the match
 *               playerId:
 *                 type: string
 *                 description: The ID of the player making the move
 *               move:
 *                 type: string
 *                 description: The move made by the player
 *               fen:
 *                 type: string
 *                 description: The updated FEN position after the move
 *     responses:
 *       200:
 *         description: Move accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/move', async (req, res) => {
    const { matchId, playerId, move, fen } = req.body;

    const gameState = await matches.getMatchById(matchId);

    if (!gameState) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const moveHistory = JSON.parse(gameState.move_history);
    moveHistory.push(move);

    await matches.updateMatchFenAndHistory(matchId, fen, moveHistory);

    const io = getIo();
    io.to(matchId.toString()).emit('move_made', { move, fen, playerId });

    res.json({ message: 'Move accepted' });
});

module.exports = router;
