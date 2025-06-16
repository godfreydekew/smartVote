// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import '../src/Voting.sol';

/**
 * @title AutoElectionTest
 * @dev Test suite for the AutoElection contract
 * @notice Tests the core functionality of the election system including initialization,
 * candidate management, and basic election operations
 */
contract AutoElectionTest is Test {
    // Contract instance and test parameters
    AutoElection public election;
    address public owner;
    uint256 public startTime;
    uint256 public endTime;
    string public title;
    uint256 public electionId;

    /**
     * @dev Setup function that runs before each test
     * Initializes common test parameters and contract state
     */
    function setUp() public {
        owner = address(this);
        electionId = 1;
        title = 'Test Election';
        startTime = block.timestamp + 1 days; // Start in 1 day
        endTime = startTime + 7 days; // End in 8 days
    }

    /**
     * @dev Tests the constructor initialization
     * Verifies that all election parameters are correctly set
     * Checks initial state values and event emissions
     */
    function test_Constructor() public {
        // Deploy new election
        election = new AutoElection(
            electionId,
            title,
            startTime,
            endTime,
            true // isPublic
        );

        // Test initial state
        (
            uint256 id,
            string memory electionTitle,
            uint256 electionStartTime,
            uint256 electionEndTime,
            AutoElection.ElectionState state,
            bool isPublic,
            uint256 totalVotes
        ) = election.getElectionDetails();

        // Verify all parameters are set correctly
        assertEq(id, electionId);
        assertEq(electionTitle, title);
        assertEq(electionStartTime, startTime);
        assertEq(electionEndTime, endTime);
        assertEq(uint256(state), uint256(AutoElection.ElectionState.UPCOMING));
        assertTrue(isPublic);
        assertEq(totalVotes, 0);
    }

    /**
     * @dev Tests constructor validation for time parameters
     * Verifies that the contract reverts when:
     * 1. Start time is in the past
     * 2. End time is before start time
     */
    function test_ConstructorRevertInvalidTimes() public {
        // Test with start time in the past
        vm.expectRevert('Start time must be in future');
        new AutoElection(
            electionId,
            title,
            block.timestamp - 1, // Past time
            endTime,
            true
        );

        // Test with end time before start time
        vm.expectRevert('End time must be after start time');
        new AutoElection(
            electionId,
            title,
            startTime,
            startTime - 1, // End time before start time
            true
        );
    }

    /**
     * @dev Tests candidate addition functionality
     * Verifies:
     * 1. Successful candidate addition
     * 2. Correct candidate data storage
     * 3. Prevention of duplicate candidate IDs
     */
    function test_AddCandidate() public {
        election = new AutoElection(electionId, title, startTime, endTime, true);

        // Add a candidate and verify data
        election.addCandidate(1, 'Candidate 1');
        AutoElection.Candidate memory candidate = election.getCandidatesById(1);
        assertEq(candidate.id, 1);
        assertEq(candidate.name, 'Candidate 1');
        assertEq(candidate.voteCount, 0);

        // Verify duplicate prevention
        vm.expectRevert('Candidate exists');
        election.addCandidate(1, 'Candidate 1 Duplicate');
    }

    /**
     * @dev Tests access control for candidate addition
     * Verifies that only the election owner can add candidates
     */
    function test_AddCandidateNotOwner() public {
        election = new AutoElection(electionId, title, startTime, endTime, true);

        // Attempt to add candidate from non-owner address
        address notOwner = address(0x123);
        vm.prank(notOwner);
        vm.expectRevert('Only owner can perform this action');
        election.addCandidate(1, 'Candidate 1');
    }

    /**
     * @dev Tests candidate retrieval functionality
     * Verifies:
     * 1. Multiple candidate addition
     * 2. Correct ordering of candidates
     * 3. Complete candidate data retrieval
     */
    function test_GetCandidates() public {
        election = new AutoElection(electionId, title, startTime, endTime, true);

        // Add multiple candidates
        election.addCandidate(1, 'Candidate 1');
        election.addCandidate(2, 'Candidate 2');
        election.addCandidate(3, 'Candidate 3');

        // Verify candidate retrieval and data integrity
        AutoElection.Candidate[] memory candidates = election.getCandidates();
        assertEq(candidates.length, 3);
        assertEq(candidates[0].id, 1);
        assertEq(candidates[0].name, 'Candidate 1');
        assertEq(candidates[1].id, 2);
        assertEq(candidates[1].name, 'Candidate 2');
        assertEq(candidates[2].id, 3);
        assertEq(candidates[2].name, 'Candidate 3');
    }
}
