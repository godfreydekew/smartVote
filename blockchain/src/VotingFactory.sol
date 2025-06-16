// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {AutoElection} from './Voting.sol';

/**
 * @title ElectionFactory
 * @dev Factory contract for creating and managing multiple elections
 * @notice This contract serves as a registry for all elections and provides
 * functionality to create new elections with their candidates
 */
contract ElectionFactory {
    /**
     * @dev Struct containing election metadata for factory tracking
     * @param electionAddress Address of the deployed election contract
     * @param id Unique identifier for the election
     * @param title Name of the election
     * @param startTime Timestamp when the election becomes active
     * @param endTime Timestamp when the election ends
     * @param isPublic Whether the election is publicly visible
     * @param owner Address of the election creator
     */
    struct Election {
        address electionAddress;
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        bool isPublic;
        address owner;
    }

    // State Variables
    Election[] public deployedElections;
    mapping(uint256 => address) public electionIdToAddress;
    mapping(address => Election[]) public electionsByOwner;

    /**
     * @dev Event emitted when a new election is deployed
     * @param id Election ID
     * @param electionAddress Address of the deployed election contract
     * @param candidatesLength Number of candidates in the election
     */
    event ElectionDeployed(uint256 id, address electionAddress, uint256 candidatesLength);

    /**
     * @dev Struct for candidate input during election creation
     * @param id Unique identifier for the candidate
     * @param name Name of the candidate
     */
    struct CandidateInput {
        uint256 id;
        string name;
    }

    /**
     * @dev Creates a new election with the specified candidates
     * @param _id Unique identifier for the election
     * @param _title Name of the election
     * @param _startTime Timestamp when the election becomes active
     * @param _endTime Timestamp when the election ends
     * @param _isPublic Whether the election is publicly visible
     * @param _candidates Array of candidates to add to the election
     */
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

        // Deploy new election contract
        AutoElection newElection = new AutoElection(_id, _title, _startTime, _endTime, _isPublic);
        address electionAddress = address(newElection);

        // Add candidates to the election
        for (uint i = 0; i < _candidates.length; i++) {
            newElection.addCandidate(_candidates[i].id, _candidates[i].name);
        }

        // Create election metadata
        Election memory newElectionData = Election({
            electionAddress: electionAddress,
            id: _id,
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            isPublic: _isPublic,
            owner: msg.sender
        });

        // Store election references
        deployedElections.push(newElectionData);
        electionIdToAddress[_id] = electionAddress;
        electionsByOwner[msg.sender].push(newElectionData);

        emit ElectionDeployed(_id, electionAddress, _candidates.length);
    }

    /**
     * @dev Returns all elections in a specific state
     * @param _state The election state to filter by
     * @return Election[] Array of elections in the specified state
     */
    function getElectionsByState(AutoElection.ElectionState _state) public view returns (Election[] memory) {
        Election[] memory tempResults = new Election[](deployedElections.length);
        uint256 counter = 0;

        // Filter elections by state
        for (uint256 i = 0; i < deployedElections.length; i++) {
            AutoElection electionContract = AutoElection(deployedElections[i].electionAddress);
            if (electionContract.getElectionState() == _state) {
                tempResults[counter] = deployedElections[i];
                counter++;
            }
        }

        // Create properly sized array for results
        Election[] memory filteredResults = new Election[](counter);
        for (uint256 i = 0; i < counter; i++) {
            filteredResults[i] = tempResults[i];
        }

        return filteredResults;
    }

    /**
     * @dev Returns all elections created by a specific owner
     * @param owner Address of the election creator
     * @return Election[] Array of elections created by the owner
     */
    function getElectionsByOwner(address owner) public view returns (Election[] memory) {
        return electionsByOwner[owner];
    }

    /**
     * @dev Returns all deployed elections
     * @return Election[] Array of all elections
     */
    function getAllElections() public view returns (Election[] memory) {
        return deployedElections;
    }

    /**
     * @dev Returns the total number of deployed elections
     * @return uint256 Number of elections
     */
    function getElectionCount() public view returns (uint256) {
        return deployedElections.length;
    }

    /**
     * @dev Returns a specific election by ID
     * @param _id ID of the election to retrieve
     * @return Election The requested election
     */
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
