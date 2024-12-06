const prisma = require("../prisma.js");

async function getMatchById(gameId) {
    return await prisma.matches.findUnique({
        where: { game_id: gameId },
    });
}

async function createMatch(data) {
    return await prisma.matches.create({
        data: {
            ...data,
            date: new Date(),
        },
    });
}

async function updateMatch(gameId, data) {
    return await prisma.matches.update({
        where: { game_id: gameId },
        data,
    });
}

async function deleteMatch(gameId) {
    return await prisma.matches.delete({
        where: { game_id: gameId },
    });
}

async function updateMatchResult(gameId, result) {
    return await prisma.matches.update({
        where: { game_id: gameId },
        data: { result },
    });
}

async function getMatchesByPlayer(playerId) {
    console.log(typeof (parseInt(playerId)));
    const matches = await prisma.matches.findMany({
        where: {
            OR: [
                { player_a: parseInt(playerId) },
                { player_b: parseInt(playerId) },
            ],
        },
    });

    return matches.map(match => ({
        ...match,
        game_id: match.game_id.toString(),
    }));
}

async function updateMatchFenAndHistory(gameId, fen, moveHistory) {
    return await prisma.matches.update({
        where: { game_id: gameId },
        data: {
            fen,
            move_history: JSON.stringify(moveHistory),
        },
    });
}

async function updateMatchPlayerB(gameId, playerId, socketID) {
    return await prisma.matches.update({
        where: { game_id: gameId },
        data: { player_b: playerId, socket_b: socketID },
    });
}

async function findMatchBySocketAndEmptyResult(socketId) {
    return await prisma.matches.findFirst({
        where: {
            result: null,
            OR: [
                { socket_a: socketId },
                { socket_b: socketId },
            ],
        },
    });
}

module.exports = {
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch,
    updateMatchResult,
    getMatchesByPlayer,
    updateMatchFenAndHistory,
    updateMatchPlayerB,
    findMatchBySocketAndEmptyResult,
};
