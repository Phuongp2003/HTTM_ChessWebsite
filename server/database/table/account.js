const prisma = require("../prisma.js");

async function getAccountById(id) {
    return await prisma.account.findUnique({
        where: { id },
    });
}

async function getAccountByUsername(username) {
    return await prisma.account.findUnique({
        where: { username },
    });
}

async function createAccount(data) {
    return await prisma.account.create({
        data,
    });
}

async function updateAccount(id, data) {
    return await prisma.account.update({
        where: { id },
        data,
    });
}

async function deleteAccount(id) {
    return await prisma.account.delete({
        where: { id },
    });
}
async function userExists(username) {
    const count = await prisma.account.count({
        where: { username },
    });
    return count > 0;
}

async function getPassword(username) {
    const account = await prisma.account.findUnique({
        where: { username },
        select: { password: true },
    });
    return account ? account.password : null;
}

async function getToken(username) {
    const account = await prisma.account.findUnique({
        where: { username },
        select: { rToken: true },
    });
    return account ? account.rToken : null;
}

async function setToken(username, rToken) {
    return await prisma.account.update({
        where: { username },
        data: { rToken },
    });
}
async function getUserInfoByUsername(username) {
    return await prisma.account.findUnique({
        where: { username },
        include: {
            user: true,
        },
    });
}

module.exports = {
    getAccountById,
    getAccountByUsername,
    createAccount,
    updateAccount,
    deleteAccount,
    userExists,
    getPassword,
    getToken,
    setToken,
    getUserInfoByUsername,
};
