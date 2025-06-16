// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AutoElection
 * @dev A smart contract for managing decentralized elections with automatic state transitions
 * @notice This contract handles the core election functionality including voting, candidate management,
 * and election state management based on time
 */
contract AutoElection {
    /**
     * @dev Enum representing the possible states of an election
     * UPCOMING: Election is created but not yet started
     * ACTIVE: Election is currently accepting votes
     * COMPLETED: Election has ended and results are final
     * CANCELLED: Election was cancelled by the owner
     */
    enum ElectionState {
        UPCOMING,
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    /**
     * @dev Struct containing all election metadata and state
     * @param id Unique identifier for the election
     * @param title Name/title of the election
     * @param startTime Timestamp when the election becomes active
     * @param endTime Timestamp when the election ends
     * @param state Current state of the election
     * @param isPublic Whether the election is publicly visible
     * @param owner Address of the election creator
     * @param totalVotes Total number of votes cast
     * @param exists Flag to check if election exists
     */
    struct Election {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        ElectionState state;
        bool isPublic;
        address owner;
        uint256 totalVotes;
        bool exists;
    }

    /**
     * @dev Struct representing a candidate in the election
     * @param id Unique identifier for the candidate
     * @param name Name of the candidate
     * @param voteCount Number of votes received
     */
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

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
     * @dev Struct tracking voter information
     * @param hasVoted Whether the address has cast a vote
     * @param voteTime Timestamp when the vote was cast
     */
    struct Voter {
        bool hasVoted;
        uint256 voteTime;
    }

    // State Variables
    Election public election;
    mapping(uint256 => Candidate) public candidates;
    uint256[] public candidateIds;
    mapping(address => Voter) public voters;

    /**
     * @dev Events for tracking important state changes
     */
    event ElectionCreated(uint256 id, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 dbid, string name);
    event VoteCast(address indexed voter, uint256 candidateId);
    event ElectionStateChanged(ElectionState newState);
    event ElectionCancelled();

    /**
     * @dev Constructor initializes a new election
     * @param _id Unique identifier for the election
     * @param _title Name of the election
     * @param _startTime Timestamp when the election becomes active
     * @param _endTime Timestamp when the election ends
     * @param _isPublic Whether the election is publicly visible
     */
    constructor(uint256 _id, string memory _title, uint256 _startTime, uint256 _endTime, bool _isPublic) {
        require(_startTime > block.timestamp, 'Start time must be in future');
        require(_endTime > _startTime, 'End time must be after start time');

        election = Election({
            id: _id,
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            state: ElectionState.UPCOMING,
            isPublic: _isPublic,
            owner: msg.sender,
            totalVotes: 0,
            exists: true
        });

        emit ElectionCreated(_id, _title, _startTime, _endTime);
    }

    /**
     * @dev Modifier to restrict function access to election owner
     */
    modifier onlyOwner() {
        require(msg.sender == election.owner, 'Only owner can perform this action');
        _;
    }

    /**
     * @dev Modifier to ensure election is in the correct state for function execution
     * @param requiredState The state the election must be in
     */
    modifier onlyValidState(ElectionState requiredState) {
        updateElectionState();
        require(election.state == requiredState, 'Invalid election state');
        _;
    }

    /**
     * @dev Updates the election state based on current time
     * Automatically transitions between UPCOMING, ACTIVE, and COMPLETED states
     */
    function updateElectionState() public {
        if (election.state == ElectionState.CANCELLED) return;

        if (block.timestamp >= election.endTime && election.state != ElectionState.COMPLETED) {
            election.state = ElectionState.COMPLETED;
            emit ElectionStateChanged(ElectionState.COMPLETED);
        } else if (block.timestamp >= election.startTime && election.state == ElectionState.UPCOMING) {
            election.state = ElectionState.ACTIVE;
            emit ElectionStateChanged(ElectionState.ACTIVE);
        }
    }

    /**
     * @dev Adds a new candidate to the election
     * @param _dbId Unique identifier for the candidate
     * @param _name Name of the candidate
     */
    function addCandidate(uint256 _dbId, string memory _name) public onlyOwner {
        require(candidates[_dbId].id == 0, 'Candidate exists');

        candidates[_dbId] = Candidate({id: _dbId, name: _name, voteCount: 0});

        candidateIds.push(_dbId);

        emit CandidateAdded(_dbId, _name);
    }

    /**
     * @dev Allows a voter to cast their vote for a candidate
     * @param _candidateId ID of the candidate to vote for
     */
    function vote(uint256 _candidateId) public onlyValidState(ElectionState.ACTIVE) {
        require(bytes(candidates[_candidateId].name).length > 0, 'Invalid candidate ID');
        require(!voters[msg.sender].hasVoted, 'Already voted');

        candidates[_candidateId].voteCount++;
        election.totalVotes++;

        voters[msg.sender] = Voter({hasVoted: true, voteTime: block.timestamp});

        emit VoteCast(msg.sender, _candidateId);
    }

    /**
     * @dev Allows the owner to cancel the election
     * Cannot cancel completed elections
     */
    function cancelElection() public onlyOwner {
        require(election.state != ElectionState.COMPLETED, 'Cannot cancel completed election');
        election.state = ElectionState.CANCELLED;
        emit ElectionCancelled();
    }

    /**
     * @dev Returns the current state of the election
     * @return ElectionState The current state of the election
     */
    function getElectionState() public view returns (ElectionState) {
        if (election.state == ElectionState.CANCELLED) return ElectionState.CANCELLED;
        if (block.timestamp >= election.endTime) return ElectionState.COMPLETED;
        if (block.timestamp >= election.startTime) return ElectionState.ACTIVE;
        return ElectionState.UPCOMING;
    }

    /**
     * @dev Returns detailed information about the election
     * @return id Election ID
     * @return title Election title
     * @return startTime Election start time
     * @return endTime Election end time
     * @return state Current election state
     * @return isPublic Whether election is public
     * @return totalVotes Total votes cast
     */
    function getElectionDetails()
        public
        view
        returns (uint256, string memory, uint256, uint256, ElectionState, bool, uint256)
    {
        ElectionState currentState = getElectionState();
        return (
            election.id,
            election.title,
            election.startTime,
            election.endTime,
            currentState,
            election.isPublic,
            election.totalVotes
        );
    }

    /**
     * @dev Returns an array of all candidates
     * @return Candidate[] Array of all candidates
     */
    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            allCandidates[i] = candidates[candidateIds[i]];
        }
        return allCandidates;
    }

    /**
     * @dev Returns candidates sorted by vote count in descending order
     * @return Candidate[] Sorted array of candidates
     */
    function getSortedResults() public view returns (Candidate[] memory) {
        Candidate[] memory sorted = getCandidates();

        for (uint256 i = 0; i < sorted.length; i++) {
            for (uint256 j = i + 1; j < sorted.length; j++) {
                if (sorted[j].voteCount > sorted[i].voteCount) {
                    Candidate memory temp = sorted[i];
                    sorted[i] = sorted[j];
                    sorted[j] = temp;
                }
            }
        }

        return sorted;
    }

    /**
     * @dev Checks if an address has voted in the election
     * @param voter Address to check
     * @return bool Whether the address has voted
     */
    function hasVoted(address voter) public view returns (bool) {
        return voters[voter].hasVoted;
    }

    /**
     * @dev Returns a specific candidate by ID
     * @param candidateId ID of the candidate to retrieve
     * @return Candidate The requested candidate
     */
    function getCandidatesById(uint256 candidateId) public view returns (Candidate memory) {
        require(bytes(candidates[candidateId].name).length > 0, 'Invalid candidate ID');
        return candidates[candidateId];
    }

    /**
     * @dev Returns election statistics
     * @return totalVotes Total number of votes cast
     * @return totalCandidates Total number of candidates
     */
    function getElectionStats() public view returns (uint256 totalVotes, uint256 totalCandidates) {
        return (election.totalVotes, candidateIds.length);
    }

    /**
     * @dev Checks if an address is eligible to vote
     * @param voter Address to check
     * @return bool Whether the address can vote
     */
    function isEligibleToVote(address voter) public view returns (bool) {
        return
            !voters[voter].hasVoted &&
            election.state == ElectionState.ACTIVE &&
            block.timestamp >= election.startTime &&
            block.timestamp < election.endTime;
    }

    /**
     * @dev Returns the address of the election owner
     * @return address The owner's address
     */
    function getEelectionOwner() public view returns (address) {
        return election.owner;
    }

    /**
     * @dev Returns the time remaining until the election ends
     * @return uint256 Time remaining in seconds
     */
    function timeRemaining() public view returns (uint256) {
        return election.endTime > block.timestamp ? election.endTime - block.timestamp : 0;
    }
}
