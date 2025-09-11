// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Voting} from './Voting.sol';

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

    event ElectionDeployed(uint256 id, address electionAddress, address owner);

    function createElection(
        uint256 _id,
        string memory _title,
        bool _isPublic
        // Timestamps are removed, as they will be set during finalization
    ) public {
        require(electionIdToAddress[_id] == address(0), 'Election ID exists');

        Voting newElection = new Voting();

        address electionAddress = address(newElection);

        Election memory newElectionData = Election({
            electionAddress: electionAddress,
            id: _id,
            title: _title,
            startTime: 0, // Will be set later
            endTime: 0,   // Will be set later
            isPublic: _isPublic,
            owner: msg.sender
        });

        // Store reference
        deployedElections.push(newElectionData);
        electionIdToAddress[_id] = electionAddress;
        electionsByOwner[msg.sender].push(newElectionData);

        emit ElectionDeployed(_id, electionAddress, msg.sender);
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