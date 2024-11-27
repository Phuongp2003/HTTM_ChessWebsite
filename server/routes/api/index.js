const { Router } = require('express');
const pveRouter = require('./pve.js');
const pvpRouter = require('./game.js');
const authRouter = require('./auth/index.js');

const router = Router();

router.use('/auth', authRouter);
router.use('/pve', pveRouter);
router.use('/pvp', pvpRouter);

module.exports = router 
