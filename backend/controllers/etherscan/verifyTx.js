const { verifyTx } = require('./etherscanService');

/**
 * POST /api/etherscan/verify
 * Body: { txHash: string, network?: 'mainnet'|'sepolia' }
 *
 * Or GET /api/etherscan/verify/:txHash?network=sepolia
 */
async function verifyTxHandler(req, res) {
  try {
    const txHash = req.body?.txHash || req.params?.txHash || req.query?.txHash;
    const network = (req.body?.network || req.query?.network || req.params?.network || 'mainnet').toLowerCase();

    if (!txHash) {
      return res.status(400).json({ error: 'txHash is required' });
    }

    // Basic validation of hash format (0x-prefixed 64 hex chars)
    if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
      return res.status(400).json({ error: 'Invalid txHash format' });
    }

    const result = await verifyTx(txHash, { network });

    // Map internal status to friendly HTTP response
    return res.json({
      txHash,
      network: result.network,
      status: result.status,
      confirmations: result.confirmations,
      blockNumber: result.blockNumber,
      tx: result.tx, // may be null if not found
      receipt: result.receipt, // may be null if not found or pending
    });
  } catch (err) {
    console.error('verifyTxHandler error', err);
    if (err.code === 'NO_ETHERSCAN_KEY') {
      return res.status(500).json({ error: 'Server misconfiguration: ETHERSCAN_API_KEY not set' });
    }
    // Detect axios/Etherscan errors
    return res.status(500).json({ error: err.message || 'Failed to verify transaction' });
  }
}

module.exports = { verifyTxHandler };
