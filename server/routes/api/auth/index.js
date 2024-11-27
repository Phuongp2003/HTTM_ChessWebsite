const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('@middleware/signatureMiddleware.js');
const { user: userdb, account: accountdb } = require('@database');
const { Router } = require('express');
const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login route
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of client account
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Password of client account
 *                 example: admin
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(await accountdb.userExists(username))) {
            res.status(401).json({ message: 'Invalid username' });
            return;
        }

        // Hash mật khẩu để kiểm tra
        const hash = crypto.createHash('sha3-512');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        if (hashedPassword !== (await accountdb.getPassword(username))) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        // Tạo JWT (access token)
        const ua = await accountdb.getAccountByUsername(username).then((account) => account);
        
        const accessToken = jwt.sign(
            { id: ua.id, uid:ua.uid, username },
            process.env.SECRET_KEY,
            { algorithm: 'HS256', expiresIn: '1h' }
        );

        // Tạo Refresh Token ngẫu nhiên
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Lưu Refresh Token trong cơ sở dữ liệu
        await userdb.setToken(username, refreshToken, 30); // 30 ngày

        res.status(200).json({
            message: 'Login successful',
            status: 200,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 500,
        });
        console.error(error);
    }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token using a refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *               - user
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *                 example: your_refresh_token_here
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     description: The username of the user
 *                     example: admin
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Refresh login successful
 *                 status:
 *                   type: integer
 *                   description: Status code
 *                   example: 200
 *                 newAccessToken:
 *                   type: string
 *                   description: The new access token
 *                   example: your_new_access_token_here
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No refresh token provided
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken, user } = req.body;

        if (!refreshToken) {
            res.status(403).json({ message: 'No refresh token provided' });
            return;
        }

        // Kiểm tra refresh token trong cơ sở dữ liệu
        const storedRefreshToken = await accountdb.getToken(user.username);
        if (refreshToken !== storedRefreshToken) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }

        // Tạo mới JWT (access token)
        const newAccessToken = jwt.sign(
            { username: user.username, permissions: user.permissions },
            process.env.SECRET_KEY,
            { algorithm: 'HS256', expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Refresh login successful',
            status: 200,
            newAccessToken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register route
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *               - nickname
 *               - avatar
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of client account
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Password of client account
 *                 example: admin
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *                 example: Doe
 *               nickname:
 *                 type: string
 *                 description: Nickname of the user
 *                 example: johndoe
 *               avatar:
 *                 type: string
 *                 description: Avatar URL of the user
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username already exists
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, nickname, avatar } = req.body;

        if (await accountdb.userExists(username)) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        // Hash mật khẩu để lưu trữ
        const hash = crypto.createHash('sha3-512');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        // Tạo người dùng mới
        const newUser = await userdb.createUser({
            firstName,
            lastName,
            nickname,
            avatar,
            elo: 0,
            trainingStatus: 0,
        });

        // Tạo tài khoản mới
        await accountdb.createAccount({
            uid: newUser.uid,
            username,
            password: hashedPassword,
        });

        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
});


/**
 * @swagger
 * /api/auth/protected:
 *   post:
 *     summary: Protected route
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticate successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                 user:
 *                 status:
 *       401:
 *         description: Token has expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token has expired.
 *       403:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token provided.
 *       500:
 *         description: Failed to authenticate token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to authenticate token.
 */
router.post(
    '/protected',
    verifyToken,
    async (req, res) => {
        res.json({
            message: 'This is a protected route',
            user: req.user,
            status: 200,
        });
    }
);

module.exports = router;
