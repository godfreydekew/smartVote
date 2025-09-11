// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MerkleProofVerifier.sol";

contract Voting is MerkleProofVerifier {
    address public owner;
    bytes32 public merkleRoot;
    mapping(bytes32 => bool) public nullifiers;
    mapping(uint256 => uint256) public results;

    event VoteCast(uint256 candidateId);
    event MerkleRootSet(bytes32 root);

    constructor() {
        owner = msg.sender;
    }

    function setMerkleRoot(bytes32 _merkleRoot) public {
        require(msg.sender == owner, "Only owner can set the Merkle root.");
        require(merkleRoot == 0, "Merkle root can only be set once.");
        merkleRoot = _merkleRoot;
        emit MerkleRootSet(_merkleRoot);
    }

    function vote(bytes32[] memory proof, bytes32 leaf, uint256 index, bytes32 nullifier, uint256 candidateId) public {
        require(merkleRoot != 0, "Merkle root not set.");
        require(!nullifiers[nullifier], "Vote already cast.");
        require(verify(proof, merkleRoot, leaf, index), "Invalid proof.");

        nullifiers[nullifier] = true;
        results[candidateId]++;

        emit VoteCast(candidateId);
    }
}
