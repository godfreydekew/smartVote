
# Todo List: Anonymous Voting with Merkle Trees

## Backend

*   [x] Install `merkletreejs` and `crypto-js`.
*   [x] Modify `backend/controllers/elections/postElection.js` to generate and store the Merkle root.
*   [x] Create a new endpoint to get the Merkle proof for a given voter.

## Smart Contracts

*   [x] Create a `MerkleProofVerifier.sol` contract.
*   [x] Modify `blockchain/src/Voting.sol` to use the `MerkleProofVerifier.sol` contract.
*   [x] Modify `blockchain/src/VotingFactory.sol` to deploy the new `Voting.sol` contract.
*   [x] Deploy the updated smart contracts.

## Frontend

*   [x] Modify the voting component to generate the nullifier.
*   [x] Modify the voting component to send the Merkle proof to the backend.
*   [x] Implement the `getMerkleProof` function to get the Merkle proof from the backend.

## Testing

*   [x] Write unit tests for the backend, smart contracts, and frontend.
*   [x] Perform end-to-end testing of the entire voting process.
