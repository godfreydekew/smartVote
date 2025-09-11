// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MerkleProofVerifier.sol";

contract Voting is MerkleProofVerifier {
    bytes32 public merkleRoot;
    mapping(bytes32 => bool) public nullifiers;
    mapping(uint256 => uint256) public results;

    event VoteCast(uint256 candidateId);

    constructor(
        bytes32 _merkleRoot
    ) {
        merkleRoot = _merkleRoot;
    }

    function vote(bytes32[] memory proof, bytes32 leaf, uint256 index, bytes32 nullifier, uint256 candidateId) public {
        require(!nullifiers[nullifier], "Vote already cast");
        require(verify(proof, merkleRoot, leaf, index), "Invalid proof");

        nullifiers[nullifier] = true;
        results[candidateId]++;

        emit VoteCast(candidateId);
    }
}
