// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AutoElection {

    enum ElectionState {
        UPCOMING,
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

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
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    struct CandidateInput {
        uint256 id;
        string name;
    }

    struct Voter {
        bool hasVoted;
        uint256 voteTime;
    }

    Election public election;
    mapping(uint256 => Candidate) public candidates;
    uint256[] public candidateIds;
    mapping(address => Voter) public voters;

    event ElectionCreated(uint256 id, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 dbid, string name);
    event VoteCast(address indexed voter, uint256 candidateId);
    event ElectionStateChanged(ElectionState newState);
    event ElectionCancelled();

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


    modifier onlyOwner() {
        require(msg.sender == election.owner, 'Only owner can perform this action');
        _;
    }

    modifier onlyValidState(ElectionState requiredState) {
        updateElectionState();
        require(election.state == requiredState, 'Invalid election state');
        _;
    }

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

    function addCandidate(uint256 _dbId, string memory _name) public onlyOwner {
        require(candidates[_dbId].id == 0, 'Candidate exists');

        candidates[_dbId] = Candidate({id: _dbId, name: _name, voteCount: 0});

        candidateIds.push(_dbId);

        emit CandidateAdded(_dbId, _name);
    }

    function vote(uint256 _candidateId) public onlyValidState(ElectionState.ACTIVE) {
        require(bytes(candidates[_candidateId].name).length > 0, 'Invalid candidate ID');
        require(!voters[msg.sender].hasVoted, 'Already voted');

        candidates[_candidateId].voteCount++;
        election.totalVotes++;

        voters[msg.sender] = Voter({hasVoted: true, voteTime: block.timestamp});

        emit VoteCast(msg.sender, _candidateId);
    }

    function cancelElection() public onlyOwner {
        require(election.state != ElectionState.COMPLETED, 'Cannot cancel completed election');
        election.state = ElectionState.CANCELLED;
        emit ElectionCancelled();
    }

    function getElectionState() public view returns (ElectionState) {
        if (election.state == ElectionState.CANCELLED) return ElectionState.CANCELLED;
        if (block.timestamp >= election.endTime) return ElectionState.COMPLETED;
        if (block.timestamp >= election.startTime) return ElectionState.ACTIVE;
        return ElectionState.UPCOMING;
    }

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

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            allCandidates[i] = candidates[candidateIds[i]];
        }
        return allCandidates;
    }

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

    function hasVoted(address voter) public view returns (bool) {
        return voters[voter].hasVoted;
    }

    function getCandidatesById(uint256 candidateId) public view returns (Candidate memory) {
        require(bytes(candidates[candidateId].name).length > 0, 'Invalid candidate ID');
        return candidates[candidateId];
    }

    function getElectionStats() public view returns (uint256 totalVotes, uint256 totalCandidates) {
        return (election.totalVotes, candidateIds.length);
    }

    function isEligibleToVote(address voter) public view returns (bool) {
        return
            !voters[voter].hasVoted &&
            election.state == ElectionState.ACTIVE &&
            block.timestamp >= election.startTime &&
            block.timestamp < election.endTime;
    }

    function getEelectionOwner() public view returns (address) {
        return election.owner;
    }

    function timeRemaining() public view returns (uint256) {
        return election.endTime > block.timestamp ? election.endTime - block.timestamp : 0;
    }
}
