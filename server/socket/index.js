const { matches } = require('../database/index.js');
const { createServer } = require('http');
const { Server } = require('socket.io');

let server;
let io;
function startSocket(app) {
    server = createServer(app);
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    return server
}

function setupSocket() {
    function convertBigIntToString(obj) {
        return JSON.parse(
            JSON.stringify(obj, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            )
        );
    }

    // PvP - Socket.IO cho thời gian thực
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Tạo phòng
        socket.on('create_room', async ({ playerId }) => {
            const gameId = Date.now();
            await matches.createMatch({
                game_id: gameId,
                player_a: playerId,
                player_b: null,
                current_turn: 'white',
                move_history: JSON.stringify([]),
            });
            socket.join(gameId.toString());
            socket.emit('room_created', { gameId, playerId });
        });

        // Tham gia trận đấu
        socket.on('join_game', async ({ gameId, playerId }) => {
            if (!gameId) {
                socket.emit('error', 'Need a room info!');
                return;
            }
            const match = await matches.getMatchById(gameId);

            if (!match) {
                
            }

            if (!match.player_b || match.player_a === match.player_b) {
                await matches.updateMatchPlayerB(gameId, playerId);
            } else {
                socket.emit('error', 'Game is full');
                return;
            }

            const gameState = await matches.getMatchById(gameId);
            socket.join(gameId.toString());
            socket.emit('join_success', { gameState: convertBigIntToString(gameState), playerId });

            if (gameState.player_b) {
                io.to(gameId).emit('choose_color', { gameId });
            }
        });

        // Chọn màu quân
        socket.on('choose_color', async ({ gameId, playerId, color }) => {
            console.log("🚀 ~ socket.on ~ gameId, playerId, color:", gameId, playerId, color)
            const match = await matches.getMatchById(gameId);

            if (!match) {
                socket.emit('error', 'Game not found');
                return;
            }

            if (color === 'white') {
                await matches.updateMatch(gameId, { white_player: playerId, current_turn: 'white' });
            } else {
                await matches.updateMatch(gameId, { white_player: match.player_a, current_turn: 'black' });
            }

            const updatedMatch = await matches.getMatchById(gameId);
            io.to(gameId.toString()).emit('color_chosen', { gameState: convertBigIntToString(updatedMatch) });
        });

        // Ghi nhận nước đi
        socket.on('make_move', async ({ gameId, playerId, move }) => {
            const match = await matches.getMatchById(gameId);

            if (!match) {
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
            await matches.updateMatch(gameId, { result: winner });
            io.to(gameId.toString()).emit('game_ended', { winner });
        });

        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);

            // const imatches = await matches.getMatchesByPlayer(socket.id);

            // if (imatches.length > 0) {
            //     const gameId = imatches[0].game_id;
            //     io.to(gameId).emit('player_disconnected', { message: 'Player disconnected' });
            // }
        });

        socket.on('reconnect', async ({ gameId, playerId }) => {
            const match = await matches.getMatchById(gameId);

            if (match) {
                socket.join(gameId.toString());
                socket.emit('reconnect_success', { gameState: convertBigIntToString(match) });
            } else {
                socket.emit('error', 'Game not found');
            }
        });
    });
}

module.exports = {  getIo: () => io , setupSocket,startSocket };
