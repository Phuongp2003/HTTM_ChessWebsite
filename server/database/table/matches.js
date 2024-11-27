const prisma = require("../prisma.js");

async function getMatchById(gameId) {
    return await prisma.matches.findUnique({
        where: { game_id: gameId },
    });
}

async function createMatch(data) {
    return await prisma.matches.create({
        data,
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
    return await prisma.matches.findMany({
        where: {
            OR: [
                { player_a: playerId },
                { player_b: playerId },
            ],
        },
    });
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

async function updateMatchPlayerB(gameId, playerId) {
    return await prisma.matches.update({
        where: { game_id: gameId },
        data: { player_b: playerId },
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
};
