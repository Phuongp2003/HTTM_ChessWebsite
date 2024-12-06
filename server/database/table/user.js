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

async function getUserByAccountId(accountId) {
    return await prisma.user.findFirst({
        where: {
            account: {
                some: {
                    id: accountId,
                },
            },
        },
    });
}


async function updateUserByAccountId(accountId, data) {
    const user = await getUserByAccountId(accountId);
    if (!user) {
        throw new Error('User not found');
    }
    return await prisma.user.update({
        where: { uid: user.uid },
        data,
    });
}

async function deleteUserByAccountId(accountId) {
    const user = await getUserByAccountId(accountId);
    if (!user) {
        throw new Error('User not found');
    }
    return await prisma.user.delete({
        where: { uid: user.uid },
    });
}

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
    setToken,
    getUserByAccountId,
    createUser,
    updateUserByAccountId,
    deleteUserByAccountId,
};
