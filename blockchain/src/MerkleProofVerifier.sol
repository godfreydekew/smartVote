// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MerkleProofVerifier {
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf,
        uint256 index
    ) public pure returns (bool) {
        bytes32 hash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if ((index & 1) == 1) {
                hash = keccak256(abi.encodePacked(proofElement, hash));
            } else {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            }

            index = index >> 1;
        }

        return hash == root;
    }
}
