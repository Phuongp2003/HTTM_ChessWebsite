const express = require('express');
const { getUserByAccountId, createUser, updateUserByAccountId, deleteUserByAccountId } = require('@database/table/user');
const router = express.Router();

/**
 * @swagger
 * /api/user/{accountId}:
 *   get:
 *     summary: Get user by account ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the account
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 elo:
 *                   type: integer
 *                 trainingStatus:
 *                   type: integer
 *       404:
 *         description: User not found
 */
router.get('/:accountId', async (req, res) => {
    try {
        const user = await getUserByAccountId(parseInt(req.params.accountId));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               nickname:
 *                 type: string
 *               avatar:
 *                 type: string
 *               elo:
 *                 type: integer
 *               trainingStatus:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 elo:
 *                   type: integer
 *                 trainingStatus:
 *                   type: integer
 */
router.post('/', async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/user/{accountId}:
 *   put:
 *     summary: Update user by account ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               nickname:
 *                 type: string
 *               avatar:
 *                 type: string
 *               elo:
 *                 type: integer
 *               trainingStatus:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 elo:
 *                   type: integer
 *                 trainingStatus:
 *                   type: integer
 *       404:
 *         description: User not found
 */
router.put('/:accountId', async (req, res) => {
    try {
        const user = await updateUserByAccountId(parseInt(req.params.accountId), req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/user/{accountId}:
 *   delete:
 *     summary: Delete user by account ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the account
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:accountId', async (req, res) => {
    try {
        await deleteUserByAccountId(parseInt(req.params.accountId));
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
