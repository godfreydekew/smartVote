const express = require('express');
const router = express.Router();
const { verifyTxHandler } = require('../controllers/etherscan/verifyTx'); // adjust path to your controllers folder

router.post('/verify', verifyTxHandler);
router.get('/verify/:txHash', verifyTxHandler);

module.exports = router;
