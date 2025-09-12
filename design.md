# Design Document: Private Elections and Phased Voting

## 1. Introduction

This document outlines the design for a new election system that supports both public and private elections, and introduces a two-phase election process. This new system will provide more flexibility and control for election administrators, and a more streamlined experience for voters.

## 2. Goals

*   Support private elections with restricted voter eligibility.
*   Implement a two-phase election process:
    *   **Phase 1: Upcoming (Voter Registration)**: Admins can add eligible voters, and users can be automatically added based on predefined criteria.
    *   **Phase 2: Active (Voting)**: The election is open for voting.
*   Allow admins to start elections manually before the scheduled start time.
*   Ensure that the system is scalable and secure.

## 3. System Architecture

The proposed changes will affect the backend, frontend, and database. The blockchain components will remain unchanged for now.

### 3.1. Database Schema

A new migration will be created to modify the `elections` table and the `eligible_voters` table.

**`elections` table:**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `SERIAL PRIMARY KEY` | Unique identifier for the election. |
| `title` | `VARCHAR(255) NOT NULL` | Title of the election. |
| `description` | `TEXT` | Description of the election. |
| `start_date` | `TIMESTAMPTZ NOT NULL` | The date and time when the election is scheduled to start. |
| `end_date` | `TIMESTAMPTZ NOT NULL` | The date and time when the election is scheduled to end. |
| `status` | `VARCHAR(255) NOT NULL DEFAULT 'upcoming'` | The current status of the election. Can be `upcoming`, `active`, or `closed`. |
| `type` | `VARCHAR(255) NOT NULL DEFAULT 'public'` | The type of election. Can be `public`, `private`, or `invite-only`. |
| `kyc_required` | `BOOLEAN NOT NULL DEFAULT FALSE` | True if KYC verification is required for voters. |
| `age_restriction` | `INTEGER[]` | Array containing [minimum age, maximum age] for voters. Null if no age restriction. |
| `regions` | `TEXT[]` | Array of country names (strings) from which voters are eligible. Null if no region restriction. |

**`candidates` table:**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `SERIAL PRIMARY KEY` | Unique identifier for the candidate. |
| `name` | `TEXT NOT NULL` | Name of the candidate. |
| `party` | `TEXT` | Political party or affiliation of the candidate. |
| `position` | `TEXT NOT NULL` | Position the candidate is running for. |
| `bio` | `TEXT` | Biography of the candidate. |
| `photo` | `TEXT` | URL to the candidate's photo. |
| `twitter` | `TEXT` | Candidate's Twitter handle. |
| `website` | `TEXT` | Candidate's personal or campaign website. |
| `election_id` | `INTEGER REFERENCES elections(id) ON DELETE CASCADE` | Foreign key to the `elections` table. |
| `UNIQUE (election_id, name)` | | Ensures a candidate's name is unique within a specific election. |

**`eligible_voters` table:**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `SERIAL PRIMARY KEY` | Unique identifier for the eligible voter. |
| `election_id` | `INTEGER REFERENCES elections(id)` | Foreign key to the `elections` table. |
| `user_id` | `INTEGER REFERENCES users(id)` | Foreign key to the `users` table. Can be `NULL` if the user is not yet registered. |
| `email` | `VARCHAR(255) NOT NULL` | The email of the eligible voter. |
| `UNIQUE (election_id, user_id)` | | Ensures a registered user is unique per election. |
| `UNIQUE (election_id, email)` | | Ensures an email is unique per election (for unregistered users). |

### 3.2. Backend

The backend will be updated to handle the new election logic.

*   **Election Creation**: The `postElection` controller will be updated to handle the creation of private elections and the new `type` and eligibility criteria fields. For `invite-only` elections, invited users will be checked against criteria, and emails will be sent.
*   **Voter Eligibility**: 
    *   A new service will be created to check if a user is eligible for any upcoming or active elections upon registration.
    *   The `eligible_voters` table will be populated with the `user_id` when a user registers or an election is created.
    *   Eligibility is also checked in real-time when a user attempts to vote.
*   **Election Listing**: The backend will filter the list of elections sent to the frontend based on the user's role and eligibility. Admins see all elections, while normal users see public elections and elections they are eligible for.
*   **Election Status**: the smart contract will automatically update the status of elections from `upcoming` to `active` when the `start_date` is reached.
*   **Manual Start**: A new endpoint will be created to allow admins to manually start an election before the scheduled `start_date`.

### 3.3. Frontend

The frontend will be updated to support the new election features.

*   **Election Creation Form**: The election creation form will be updated to include options for creating private elections, specifying the election type, and defining eligibility criteria. It will also provide feedback on failed invitations for `invite-only` elections.
*   **Election Details Page**: The election details page will be updated to display the election status and type, and to disable the vote button for ineligible users.
*   **Admin Dashboard**: The admin dashboard will be updated to include a button to manually start an election.
*   **Election Listing**: The election listing will visually distinguish between public, private, and invite-only elections using badges or icons.

## 4. Implementation Details

### 4.1. Database Migration

New migration files will be created to alter the `elections` and `eligible_voters` tables, and to update the `candidates` table.

### 4.2. Backend

*   The `postElection` controller will be updated to handle the new fields and process invitations.
*   A new `checkEligibility` service will be created to check if a user is eligible for any elections.
*   A new `startElection` controller will be created to manually start an election.
*   Email sending logic will be refactored into a shared utility.
*   Eligibility criteria checking logic will be refactored into a shared utility.

### 4.3. Frontend

*   The `ElectionCreationForm` component will be updated to include the new fields and display invitation results.
*   The `ElectionDetails` component will be updated to display the new information and disable voting for ineligible users.
*   A new button will be added to the `AdminDashboard` to manually start an election.
*   The election listing components (`ElectionTabs`, `ElectionsGrid`, `ElectionCard`) will be updated to display election types visually.

## 5. Security Considerations

*   The `checkEligibility` service will be designed to be efficient and scalable.
*   All new endpoints will be protected by authentication and authorization middleware.
*   Eligibility checks are performed on both frontend (for UX) and backend (for security).

## 6. Election Types Definition

This section defines the behavior of each election type based on the `type` column:

### 6.1. `public` Election
*   **Visibility**: The election (its existence, title, description, and potentially results/analytics) is discoverable and viewable by *anyone* on the platform.
*   **Voting Access**: Open to any user who meets the defined eligibility criteria. Users can self-register to vote if they qualify.
*   **Eligibility Criteria (`kyc_required`, `age_restriction`, `regions`)**: These are *optional* filters that can be applied. If applied, only users meeting these criteria can vote.
*   **Invitation Links**: While not the primary access method, an admin *could* generate a general invitation link for convenience, but it would still lead to a public election where eligibility criteria apply.

### 6.2. `private` Election
*   **Visibility**: The election is *not* publicly discoverable. It is visible *only to users who meet the defined eligibility criteria*.
*   **Voting Access**: Open to any user who meets the defined eligibility criteria. Users can self-register to vote if they qualify, provided they are eligible to view the election.
*   **Eligibility Criteria (`kyc_required`, `age_restriction`, `regions`)**: These are *optional* filters that can be applied. If applied, only users meeting these criteria can vote.
*   **Invitation Links**: Similar to public, an admin *could* generate a general invitation link for convenience, but it would lead to a private election where eligibility criteria apply.

### 6.3. `invite-only` Election
*   **Visibility**: The election is *not* publicly discoverable. Only users explicitly on an "invite list" can see it.
*   **Voting Access**: Only users explicitly on an "invite list" (e.g., via email, or a pre-registered list) can vote. Eligibility criteria are checked for existing users upon invitation.
*   **Eligibility Criteria (`kyc_required`, `age_restriction`, `regions`)**: These are *optional* filters that can be applied *in addition to* being on the invite list. Only invited users who *also* meet these criteria can vote.
*   **Invitation Links**: The primary access mechanism. Links are tied to the pre-approved invite list.