// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidates {
        string name;
        int8 count;
        address[] voters;
    }
    Candidates[] public candidates;

    // constructor()
    event CandidateAdded(string name, uint256 index);
    event VoteCast(address voter, uint256 candidateIndex);

    function addCandidate(string memory _name) public {
        for (uint256 i = 0; i < candidates.length; i++) {
            require(
                keccak256(bytes(candidates[i].name)) != keccak256(bytes(_name)),
                "Candidate already exists"
            );
        }
        candidates.push(Candidates(_name, 0, new address[](0)));
        emit CandidateAdded(_name, candidates.length - 1);
    }

    function getCandidates() public view returns (Candidates[] memory) {
        return candidates;
    }

    function getCandidate(
        uint256 index
    ) public view returns (Candidates memory) {
        require(candidates.length > index, "Index out of bounds");
        return candidates[index];
    }

    function vote(uint256 _index) public {
        candidates[_index].count++;
        candidates[_index].voters.push(msg.sender);
        emit VoteCast(msg.sender, _index);
    }
}