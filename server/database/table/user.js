const prisma = require("../prisma.js");

async function getUserById(uid) {
    return await prisma.user.findUnique({
        where: { uid },
    });
}

async function createUser(data) {
    return await prisma.user.create({
        data,
    });
}

async function updateUser(uid, data) {
    return await prisma.user.update({
        where: { uid },
        data,
    });
}

async function deleteUser(uid) {
    return await prisma.user.delete({
        where: { uid },
    });
}


async function setToken(username, rToken, days) {
    return await prisma.account.update({
        where: { username },
        data: { rToken },
    });
}

module.exports = {
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    setToken
};
