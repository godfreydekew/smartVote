const { createThirdwebClient, getContract } = require('thirdweb');
const { sepolia } = require('thirdweb/chains');

// Use Node.js environment variables
// const clientId = process.env.TEMPLATE_CLIENT_ID;
const clientId = '7587edc8de012685eb8c9083058548e6';
const contractFactoryAddress = '0xB2C5664f8FA88523DEb5761dA77fCea6B507303f';

// Create a Thirdweb client
const client = createThirdwebClient({
  clientId,
});

// Preload the election factory contract
const electionFactoryContract = getContract({
  client,
  chain: sepolia,
  address: contractFactoryAddress,
});

// Utility to get a single election contract by address
const singleElectionContract = address => {
  return getContract({
    client,
    chain: sepolia,
    address,
  });
};

module.exports = {
  client,
  electionFactoryContract,
  singleElectionContract,
};
