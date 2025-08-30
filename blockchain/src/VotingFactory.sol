// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {AutoElection} from './Voting.sol';

contract ElectionFactory {
    struct Election {
        address electionAddress;
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        bool isPublic;
        address owner;
    }

    Election[] public deployedElections;
    mapping(uint256 => address) public electionIdToAddress;
    mapping(address => Election[]) public electionsByOwner;

    event ElectionDeployed(uint256 id, address electionAddress, uint256 candidatesLength);

    struct CandidateInput {
        uint256 id;
        string name;
    }

    function createElectionWithCandidates(
        uint256 _id,
        string memory _title,
        uint256 _startTime,
        uint256 _endTime,
        bool _isPublic,
        CandidateInput[] calldata _candidates
    ) public {
        require(electionIdToAddress[_id] == address(0), 'Election ID exists');
        require(_candidates.length > 0, 'At least 1 candidate required');
        require(_startTime > block.timestamp, 'Start time must be in future');

        AutoElection newElection = new AutoElection(_id, _title, _startTime, _endTime, _isPublic);

        address electionAddress = address(newElection);

        for (uint i = 0; i < _candidates.length; i++) {
            newElection.addCandidate(_candidates[i].id, _candidates[i].name);
        }

        Election memory newElectionData = Election({
            electionAddress: electionAddress,
            id: _id,
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            isPublic: _isPublic,
            owner: msg.sender
        });

        // Store reference
        deployedElections.push(newElectionData);
        electionIdToAddress[_id] = electionAddress;
        electionsByOwner[msg.sender].push(newElectionData);

        emit ElectionDeployed(_id, electionAddress, _candidates.length);
    }

    function getElectionsByState(AutoElection.ElectionState _state) public view returns (Election[] memory) {
        Election[] memory tempResults = new Election[](deployedElections.length);
        uint256 counter = 0;

        for (uint256 i = 0; i < deployedElections.length; i++) {
            AutoElection electionContract = AutoElection(deployedElections[i].electionAddress);
            if (electionContract.getElectionState() == _state) {
                tempResults[counter] = deployedElections[i];
                counter++;
            }
        }

        Election[] memory filteredResults = new Election[](counter);
        for (uint256 i = 0; i < counter; i++) {
            filteredResults[i] = tempResults[i];
        }

        return filteredResults;
    }

    function getElectionsByOwner(address owner) public view returns (Election[] memory) {
        return electionsByOwner[owner];
    }

    function getAllElections() public view returns (Election[] memory) {
        return deployedElections;
    }

    function getElectionCount() public view returns (uint256) {
        return deployedElections.length;
    }

    function getElectionById(uint256 _id) public view returns (Election memory) {
        require(electionIdToAddress[_id] != address(0), 'Election not found');

        for (uint256 i = 0; i < deployedElections.length; i++) {
            if (deployedElections[i].id == _id) {
                return deployedElections[i];
            }
        }

        revert('Election not found');
    }
}