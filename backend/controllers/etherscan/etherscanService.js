const axios = require('axios');

const DEFAULT_BASES = {
  mainnet: process.env.ETHERSCAN_BASE_URL_MAINNET || 'https://api.etherscan.io',
  sepolia: process.env.ETHERSCAN_BASE_URL_SEPOLIA || 'https://api-sepolia.etherscan.io',
  // add other networks here if needed; for testnets you may need different hostnames.
};

/**
 * Build etherscan API url for a given network and query params.
 * @param {'mainnet'|'sepolia'|string} network
 * @param {object} params
 * @returns {string} full url
 */
function buildEtherscanUrl(network = 'mainnet', params = {}) {
  const base = DEFAULT_BASES[network] || DEFAULT_BASES.mainnet;
  const qs = new URLSearchParams(params);
  return `${base}/api?${qs.toString()}`;
}

/**
 * Low-level call to Etherscan API via axios
 */
async function callEtherscan(network, params) {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) {
    const err = new Error('ETHERSCAN_API_KEY not configured on server');
    err.code = 'NO_ETHERSCAN_KEY';
    throw err;
  }
  const finalParams = { ...params, apikey: apiKey };
  const url = buildEtherscanUrl(network, finalParams);

  // Call with a small timeout
  const resp = await axios.get(url, { timeout: 12_000 });
  // Etherscan returns HTTP 200 even for errors; check result status and message
  if (!resp?.data) {
    const e = new Error('No response body from Etherscan');
    e.raw = resp;
    throw e;
  }
  return resp.data;
}

/**
 * Fetch transaction by hash using proxy.eth_getTransactionByHash
 * returns null if tx not found
 */
async function getTransactionByHash(network, txHash) {
  const data = await callEtherscan(network, {
    module: 'proxy',
    action: 'eth_getTransactionByHash',
    txhash: txHash,
  });
  // data.result can be null if not yet seen
  return data.result || null;
}

/**
 * Fetch transaction receipt using proxy.eth_getTransactionReceipt
 */
async function getTransactionReceipt(network, txHash) {
  const data = await callEtherscan(network, {
    module: 'proxy',
    action: 'eth_getTransactionReceipt',
    txhash: txHash,
  });
  return data.result || null;
}

/**
 * Get latest block number (hex string -> parse to integer)
 */
async function getLatestBlockNumber(network) {
  const data = await callEtherscan(network, {
    module: 'proxy',
    action: 'eth_blockNumber',
  });
  // example result: "0x10d4f" -> parseInt(hex, 16)
  if (!data.result) return null;
  return parseInt(data.result, 16);
}

/**
 * Public helper: verifyTx(hash, opts) -> returns combined info
 *
 * result shape:
 * {
 *   tx: {...} | null,
 *   receipt: {...} | null,
 *   status: 'pending' | 'success' | 'failed',
 *   blockNumber: number | null,
 *   confirmations: number | null,
 *   raw: { txRaw, receiptRaw }
 * }
 */
async function verifyTx(txHash, opts = {}) {
  const network = (opts.network || 'mainnet').toLowerCase();
  if (!txHash || typeof txHash !== 'string') {
    const err = new Error('Invalid txHash');
    err.code = 'INVALID_TX_HASH';
    throw err;
  }

  // Do calls in parallel when possible
  const [txRaw, receiptRaw, latestBlock] = await Promise.allSettled([
    getTransactionByHash(network, txHash),
    getTransactionReceipt(network, txHash),
    getLatestBlockNumber(network),
  ]);

  // Normalize results
  const tx = txRaw.status === 'fulfilled' ? txRaw.value : null;
  const receipt = receiptRaw.status === 'fulfilled' ? receiptRaw.value : null;
  const latest = latestBlock.status === 'fulfilled' ? latestBlock.value : null;

  // Compute blockNumber (hex -> int) if present in tx or receipt
  let blockNumber = null;
  if (receipt && receipt.blockNumber) {
    blockNumber = parseInt(receipt.blockNumber, 16);
  } else if (tx && tx.blockNumber) {
    blockNumber = parseInt(tx.blockNumber, 16);
  }

  // confirmations
  const confirmations =
    blockNumber !== null && Number.isInteger(latest)
      ? Math.max(0, latest - blockNumber + 1)
      : null;

  // Determine status
  // If no receipt and no blockNumber -> pending
  // If receipt.status === '0x1' or '1' -> success
  // If receipt.status === '0x0' or '0' -> failed
  let status = 'pending';
  if (receipt && receipt.status !== undefined && receipt.status !== null) {
    const s = String(receipt.status).toLowerCase();
    if (s === '0x1' || s === '1') status = 'success';
    else if (s === '0x0' || s === '0') status = 'failed';
    else status = s; // unknown string
  } else if (!tx && !receipt) {
    status = 'not_found';
  }

  return {
    tx,
    receipt,
    status,
    blockNumber,
    confirmations,
    network,
    raw: { txRaw: tx, receiptRaw: receipt, latestBlock: latest },
  };
}

module.exports = {
  verifyTx,
  getTransactionByHash,
  getTransactionReceipt,
  getLatestBlockNumber,
};
