const express = require('express');
const { spawn } = require('child_process');
const { Chess } = require('chess.js');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');

const app = express();
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const port = process.env.PORT;
const games = {};

// Middleware
app.use(express.json());
app.use(cors());

// Kết nối cơ sở dữ liệu
let db;
async function connectToDatabase() {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'game_db',
    });
}
connectToDatabase().catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
});

async function loadCorsSettings() {
    return {
        allowedOrigins: ['http://localhost:5173'],
    };
}

// Configure CORS dynamically
app.use(async (req, res, next) => {
    const settings = await loadCorsSettings();
    cors({
        origin: (origin, callback) => {
            if (
                (typeof origin === 'string' &&
                    settings.allowedOrigins.includes(origin)) ||
                !origin
            ) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })(req, res, next);
});

// Engine cờ vua (PvE)
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
const enginePath = require('path').join(__dirname, 'node_modules', 'stockfish', 'src', 'stockfish-nnue-16.js');
const engine = spawn('node', [enginePath], { stdio: ['pipe', 'pipe', 'pipe'] });

let currentFen;

// PvE - Bắt đầu game
app.post('/start', (req, res) => {
    currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // Khởi tạo FEN
    engine.stdin.write(`setoption name UCI_LimitStrength value true\n`);
    engine.stdin.write(`setoption name UCI_Elo value 100\n`);
    res.json({ message: 'Game started', fen: currentFen });
});

// API để nhận nước đi
app.post('/move', (req, res) => {
    const { move } = req.body;
    console.log("🚀 ~ app.post ~ move:", move)

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
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// PvP - Bắt đầu game
app.post('/api/game/start', async (req, res) => {
    const { gameId, playerId, playerColor } = req.body;
    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    // Fetch the game state to verify the player
    const [rows] = await db.query(`SELECT * FROM matches WHERE game_id = ?`, [gameId]);

    if (rows.length === 0) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const gameState = rows[0];

    // Check if the player is the white player
    if (gameState.player_a !== playerId) {
        return res.status(403).json({ error: 'Only the white player can start the game' });
    }

    await db.query(
        `UPDATE matches SET fen = ?, move_history = ? WHERE game_id = ?`,
        [initialFen, JSON.stringify([]), gameId]
    );

    io.to(gameId.toString()).emit('game_started', { gameId, playerColor });

    res.json({ gameId, playerColor, message: 'Game started', fen: initialFen });
});

// PvP - Nhận nước đi
app.post('/api/game/move', async (req, res) => {
    const { matchId, playerId, move, fen } = req.body;

    const [rows] = await db.query(`SELECT * FROM matches WHERE game_id = ?`, [matchId]);

    if (rows.length === 0) {
        return res.status(404).json({ error: 'Game not found' });
    }

    const gameState = rows[0];

    // // Check if the player making the move is the correct player based on the current turn
    // const currentTurnPlayer = gameState.current_turn === 'white' ? gameState.player_a : gameState.player_b;
    // if (currentTurnPlayer !== playerId) {
    //     return res.status(403).json({ error: 'Not your turn!' });
    // }

    const moveHistory = JSON.parse(gameState.move_history);
    moveHistory.push(move);

    await db.query(
        `UPDATE matches SET fen = ?, current_turn = ?, move_history = ? WHERE game_id = ?`,
        [fen, fen.split(' ')[1] === 'w' ? 'white' : 'black', JSON.stringify(moveHistory), matchId]
    );

    io.to(matchId.toString()).emit('move_made', { move, fen, playerId });

    res.json({ message: 'Move accepted' });
});

// PvP - Socket.IO cho thời gian thực
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Tạo phòng
    socket.on('create_room', async ({ playerId }) => {
        const gameId = Date.now();
        await db.query(
            `INSERT INTO matches (game_id, player_a, player_b, current_turn, move_history) VALUES (?, ?, ?, ?, ?)`,
            [gameId, playerId, null, 'white', JSON.stringify([])]
        );
        socket.join(gameId.toString());
        socket.emit('room_created', { gameId, playerId });
    });

    // Tham gia trận đấu
    socket.on('join_game', async ({ gameId, playerId }) => {
        const [rows] = await db.query(`SELECT * FROM matches WHERE game_id = ?`, [gameId]);

        console.log("🚀 ~ socket.on ~ gameId:", gameId)
        if (rows.length === 0) {
            socket.emit('error', 'Game not found');
            return;
        }

        const gameState = rows[0];
        if (!gameState.player_b || gameState.player_a === gameState.player_b) {
            await db.query(`UPDATE matches SET player_b = ? WHERE game_id = ?`, [playerId, gameId]);
        } else {
            socket.emit('error', 'Game is full');
            return;
        }

        socket.join(gameId.toString());
        socket.emit('join_success', { gameState, playerId });

        if (gameState.player_b) {
            io.to(gameId.toString()).emit('choose_color', { gameId });
        }
    });

    // Chọn màu quân
    socket.on('choose_color', async ({ gameId, playerId, color }) => {
        const [rows] = await db.query(`SELECT * FROM matches WHERE game_id = ?`, [gameId]);

        if (rows.length === 0) {
            socket.emit('error', 'Game not found');
            return;
        }

        const gameState = rows[0];
        if (color === 'white') {
            await db.query(`UPDATE matches SET white_player = ?, current_turn = ? WHERE game_id = ?`, [playerId, 'white', gameId]);
        } else {
            await db.query(`UPDATE matches SET white_player = ?, current_turn = ? WHERE game_id = ?`, [gameState.player_a, 'black', gameId]);
        }

        io.to(gameId.toString()).emit('color_chosen', { gameState });
    });

    // Ghi nhận nước đi
    socket.on('make_move', async ({ gameId, playerId, move }) => {
        const [rows] = await db.query(`SELECT * FROM matches WHERE game_id = ?`, [gameId]);

        if (rows.length === 0) {
            socket.emit('error', 'Game not found');
            return;
        }

        // const gameState = rows[0];
        // if (gameState.current_turn !== playerId) {
        //     socket.emit('error', 'Not your turn!');
        //     return;
        // }

        // const fen = gameState.fen; // Lấy FEN hiện tại từ DB
        // const newFen = updateFen(fen, move); // Hàm cập nhật FEN sau khi nhận nước đi

        // const moveHistory = JSON.parse(gameState.move_history);
        // moveHistory.push(move);

        // await db.query(
        //     `UPDATE matches SET fen = ?, current_turn = ?, move_history = ? WHERE game_id = ?`,
        //     [newFen, newFen.split(' ')[1] === 'w' ? 'white' : 'black', JSON.stringify(moveHistory), gameId]
        // );

        // io.to(gameId.toString()).emit('move_made', { playerId, move, fen: newFen });
    });

    // Kết thúc trận đấu
    socket.on('end_game', async ({ gameId, winner }) => {
        await db.query(`UPDATE matches SET result = ? WHERE game_id = ?`, [winner, gameId]);
        io.to(gameId.toString()).emit('game_ended', { winner });
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);

        // Xử lý trạng thái trận đấu nếu cần
        const [rows] = await db.query(
            `SELECT game_id FROM matches WHERE player_a = ? OR player_b = ?`,
            [socket.id, socket.id]
        );

        if (rows.length > 0) {
            const gameId = rows[0].game_id;
            io.to(gameId.toString()).emit('player_disconnected', { message: 'Player disconnected' });
        }
    });

    socket.on('reconnect', async ({ gameId, playerId }) => {
        const [rows] = await db.query(`SELECT * FROM matches WHERE game_id = ?`, [gameId]);

        if (rows.length > 0) {
            const gameState = rows[0];
            socket.join(gameId.toString());
            socket.emit('reconnect_success', { gameState });
        } else {
            socket.emit('error', 'Game not found');
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
