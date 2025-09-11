pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/merkle.circom";
include "../../node_modules/circomlib/circuits/sha256/sha256.circom";

template Vote(levels) {
    signal input secretKey;
    signal input electionId;
    signal input merkleProof[levels];
    signal input merkleRoot;

    // 1. Derive public key from secret key
    component publicKeyHasher = Sha256(256);
    publicKeyHasher.in <== secretKey;
    signal publicKey <== publicKeyHasher.out;

    // 2. Verify the Merkle proof
    component merkleProofVerifier = MerkleTreeChecker(levels);
    merkleProofVerifier.leaf <== publicKey;
    for (var i = 0; i < levels; i++) {
        merkleProofVerifier.path[i] <== merkleProof[i];
    }
    merkleProofVerifier.root <== merkleRoot;

    // 3. Generate and verify the nullifier
    component nullifierHasher = Sha256(512);
    nullifierHasher.in[0] <== secretKey;
    nullifierHasher.in[1] <== electionId;
    signal nullifier <== nullifierHasher.out;

    // 4. Output the nullifier and the merkle root
    signal output nullifierOut <== nullifier;
    signal output merkleRootOut <== merkleRoot;
}

component main = Vote(20);
