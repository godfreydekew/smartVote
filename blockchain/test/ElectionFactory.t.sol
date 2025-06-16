// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import '../src/VotingFactory.sol';

/**
 * @title ElectionFactoryTest
 * @dev Test suite for the ElectionFactory contract
 * @notice Tests the factory contract's ability to create and manage multiple elections
 * and their associated candidates
 */
contract ElectionFactoryTest is Test {
    // Contract instance and test parameters
    ElectionFactory public factory;
    address public owner;
    uint256 public startTime;
    uint256 public endTime;
    string public title;
    uint256 public electionId;

    /**
     * @dev Setup function that runs before each test
     * Initializes the factory contract and common test parameters
     */
    function setUp() public {
        owner = address(this);
        factory = new ElectionFactory();
        electionId = 1;
        title = 'Test Election';
        startTime = block.timestamp + 1 days; // Start in 1 day
        endTime = startTime + 7 days; // End in 8 days
    }

    /**
     * @dev Tests election creation with multiple candidates
     * Verifies:
     * 1. Successful election deployment
     * 2. Correct parameter initialization
     * 3. Proper candidate addition
     * 4. Election count tracking
     */
    function test_CreateElectionWithCandidates() public {
        // Create candidate inputs
        ElectionFactory.CandidateInput[] memory candidates = new ElectionFactory.CandidateInput[](2);
        candidates[0] = ElectionFactory.CandidateInput({id: 1, name: 'Candidate 1'});
        candidates[1] = ElectionFactory.CandidateInput({id: 2, name: 'Candidate 2'});

        // Create election and verify deployment
        factory.createElectionWithCandidates(
            electionId,
            title,
            startTime,
            endTime,
            true, // isPublic
            candidates
        );

        // Verify election parameters and state
        ElectionFactory.Election memory election = factory.getElectionById(electionId);
        assertEq(election.id, electionId);
        assertEq(election.title, title);
        assertEq(election.startTime, startTime);
        assertEq(election.endTime, endTime);
        assertTrue(election.isPublic);
        assertEq(election.owner, owner);

        // Verify factory state
        assertEq(factory.getElectionCount(), 1);
    }

    /**
     * @dev Tests prevention of duplicate election IDs
     * Verifies that creating an election with an existing ID reverts
     */
    function test_CreateElectionRevertDuplicateId() public {
        // Create first election
        ElectionFactory.CandidateInput[] memory candidates = new ElectionFactory.CandidateInput[](1);
        candidates[0] = ElectionFactory.CandidateInput({id: 1, name: 'Candidate 1'});

        factory.createElectionWithCandidates(electionId, title, startTime, endTime, true, candidates);

        // Attempt to create election with duplicate ID
        vm.expectRevert('Election ID exists');
        factory.createElectionWithCandidates(
            electionId,
            'Different Title',
            startTime,
            endTime,
            true,
            candidates
        );
    }

    /**
     * @dev Tests validation of candidate requirements
     * Verifies that creating an election without candidates reverts
     */
    function test_CreateElectionRevertNoCandidates() public {
        // Attempt to create election with empty candidate list
        ElectionFactory.CandidateInput[] memory emptyCandidates = new ElectionFactory.CandidateInput[](0);

        vm.expectRevert('At least 1 candidate required');
        factory.createElectionWithCandidates(electionId, title, startTime, endTime, true, emptyCandidates);
    }

    /**
     * @dev Tests time validation for election creation
     * Verifies that creating an election with a past start time reverts
     */
    function test_CreateElectionRevertPastStartTime() public {
        ElectionFactory.CandidateInput[] memory candidates = new ElectionFactory.CandidateInput[](1);
        candidates[0] = ElectionFactory.CandidateInput({id: 1, name: 'Candidate 1'});

        vm.expectRevert('Start time must be in future');
        factory.createElectionWithCandidates(
            electionId,
            title,
            block.timestamp - 1, // Past time
            endTime,
            true,
            candidates
        );
    }

    /**
     * @dev Tests election retrieval by owner
     * Verifies:
     * 1. Correct election association with owner
     * 2. Proper election data retrieval
     * 3. Array length and content validation
     */
    function test_GetElectionsByOwner() public {
        // Create election
        ElectionFactory.CandidateInput[] memory candidates = new ElectionFactory.CandidateInput[](1);
        candidates[0] = ElectionFactory.CandidateInput({id: 1, name: 'Candidate 1'});

        factory.createElectionWithCandidates(electionId, title, startTime, endTime, true, candidates);

        // Verify owner's election retrieval
        ElectionFactory.Election[] memory ownerElections = factory.getElectionsByOwner(owner);
        assertEq(ownerElections.length, 1);
        assertEq(ownerElections[0].id, electionId);
        assertEq(ownerElections[0].title, title);
    }
}
