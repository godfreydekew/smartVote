const { ethers } = require('ethers');

// This function requires the following environment variables to be set:
// RPC_URL: The URL of the Ethereum JSON-RPC endpoint (e.g., from Infura or Alchemy).
// ADMIN_PRIVATE_KEY: The private key of the wallet that owns the Voting contracts and will pay for gas.

const setMerkleRootOnContract = async (contractAddress, merkleRoot) => {
  if (!process.env.RPC_URL || !process.env.ADMIN_PRIVATE_KEY) {
    throw new Error('RPC_URL and ADMIN_PRIVATE_KEY must be set in the environment variables.');
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

  // A minimal ABI for the Voting contract, specifically for the setMerkleRoot function.
  // You should replace this with the full ABI from your compiled contract for production.
  const contractAbi = [
    "function setMerkleRoot(bytes32 _merkleRoot)"
  ];

  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  console.log(`Submitting transaction to set Merkle root for contract: ${contractAddress}`);
  
  // The merkleRoot from the backend is a hex string without the '0x' prefix.
  const formattedMerkleRoot = '0x' + merkleRoot;

  try {
    const tx = await contract.setMerkleRoot(formattedMerkleRoot);
    console.log(`Transaction sent. Hash: ${tx.hash}`);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(`Transaction confirmed. Block Number: ${receipt.blockNumber}`);
    
    return receipt;
  } catch (error) {
    console.error(`Failed to set Merkle root on contract ${contractAddress}:`, error);
    throw new Error('Blockchain transaction failed.');
  }
};

module.exports = { setMerkleRootOnContract };
