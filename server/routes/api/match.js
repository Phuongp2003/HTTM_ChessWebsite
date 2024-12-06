const { Router } = require('express');
const { matches } = require('@database')
const router = Router();

/**
 * @swagger
 * /api/match/history/{uid}:
 *   get:
 *     summary: Get matches history by user ID
 *     tags:
 *       - Game
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Matches history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No matches found
 */
router.get('/history/:uid', async (req, res) => {
    try {
        const gMatches = await matches.getMatchesByPlayer(req.params.uid);
        if (!gMatches.length) {
            return res.status(404).json({ message: 'No matches found' });
        }
        res.json(gMatches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/match/{gameId}:
 *   get:
 *     summary: Get match by game ID
 *     tags:
 *       - Game
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game
 *     responses:
 *       200:
 *         description: Match retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Match not found
 */
router.get('/:gameId', async (req, res) => {
    try {
        const match = await matches.getMatchById(req.params.gameId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
