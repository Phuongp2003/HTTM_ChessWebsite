const { Router } = require('express');
const pveRouter = require('./pve.js');
const pvpRouter = require('./game.js');
const trainRouter = require('./train.js');
const userRouter = require('./user.js');
const matchRouter = require('./match.js');
const authRouter = require('./auth/index.js');

const router = Router();

router.use('/auth', authRouter);
router.use('/pve', pveRouter);
router.use('/pvp', pvpRouter);
router.use('/train', trainRouter);
router.use('/user', userRouter);
router.use('/match', matchRouter);

module.exports = router 
