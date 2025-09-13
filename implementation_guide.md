# Implementation Guide: Private Elections and Phased Voting

This document provides a step-by-step guide to implementing the new private election and phased voting features.

## 1. Database Migration

### 1.1. Create a New Migration File (`add_election_type.js`)

Create a new file `backend/database/migrations/add_election_type.js`.

### 1.2. Update `elections` Table (`add_election_type.js`)

Alter the `elections` table to add the `type` and `kyc_required` columns and drop the now redundant `is_public` column.

```javascript
// backend/database/migrations/add_election_type.js

const { pool } = require('../db');

async function updateElectionsTable() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
            ALTER TABLE elections
            ADD COLUMN type VARCHAR(255) NOT NULL DEFAULT 'public',
            ADD COLUMN kyc_required BOOLEAN NOT NULL DEFAULT FALSE,
            DROP COLUMN is_public;
        `);

        await client.query('COMMIT');
        console.log('elections table updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating elections table:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    updateElectionsTable
};
```

### 1.3. Update `eligible_voters` Table (`add_election_type.js`)

Modify the `eligible_voters` table to use `email` and a nullable `user_id` for identifying voters, removing the generic `user_identifier` column.

```javascript
// backend/database/migrations/add_election_type.js

// ... (previous code)

async function updateEligibleVotersTable() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
            ALTER TABLE eligible_voters
            DROP COLUMN user_identifier,
            ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            ADD COLUMN email VARCHAR(255);
        `);

        // Add a unique constraint on election_id and email
        await client.query(`
            ALTER TABLE eligible_voters
            ADD CONSTRAINT unique_election_email UNIQUE (election_id, email);
        `);

        // Add a unique constraint on election_id and user_id for registered users
        await client.query(`
            ALTER TABLE eligible_voters
            ADD CONSTRAINT unique_election_user UNIQUE (election_id, user_id);
        `);


        await client.query('COMMIT');
        console.log('eligible_voters table updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating eligible_voters table:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    updateElectionsTable,
    updateEligibleVotersTable
};
```

### 1.4. Create a New Migration File (`update_candidates_table.js`)

Create a new file `backend/database/migrations/update_candidates_table.js` to update the `candidates` table.

```javascript
// backend/database/migrations/update_candidates_table.js
const { pool } = require('../db');

async function updateCandidatesTable() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Remove the UNIQUE constraint on 'name'
        await client.query(`
            ALTER TABLE candidates
            DROP CONSTRAINT IF EXISTS candidates_name_key;
        `);

        // Add the composite UNIQUE constraint on 'election_id' and 'name'
        await client.query(`
            ALTER TABLE candidates
            ADD CONSTRAINT unique_election_candidate UNIQUE (election_id, name);
        `);

        await client.query('COMMIT');
        console.log('candidates table updated successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating candidates table:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    updateCandidatesTable
};
```

### 1.5. Run the Migrations

Update `backend/index.js` to run all migration functions.

```javascript
// backend/index.js

// ... (previous code)

const { createTables } = require('./database/migrations/createTables.js');
const { updateElectionsTable, updateEligibleVotersTable } = require('./database/migrations/add_election_type.js');
const { updateCandidatesTable } = require('./database/migrations/update_candidates_table.js');

(async () => {
  await createTables();
  await updateElectionsTable();
  await updateEligibleVotersTable();
  await updateCandidatesTable();
})();

// ... (rest of the server startup code)
```
**Note:** Running migrations directly in the main application startup is not ideal for production but is acceptable for this project's current structure.

## 2. Backend

### 2.1. Update `postElection` Controller

Modify `backend/controllers/elections/postElection.js` to handle the new `type`, `kyc_required`, `age_restriction`, `regions`, and `invitedEmails` fields. The validation schema will also need to be updated. For `invite-only` elections, use `processInvitations` to check eligibility for existing users and send invitation emails.

### 2.2. Refactor `checkEligibility` Logic

The `checkEligibility` logic, previously intended as a service, has been refactored into a shared utility function `checkCriteria` located at `backend/database/utils/criteria.js`. This function is used by `addUserToEligibleElections` and `processInvitations`.

### 2.3. Update `register` Controller

Modify `backend/controllers/auth/register.js` to:
1.  After creating a new user, call `addUserToEligibleElections` to check if they match criteria for any upcoming elections.
2.  Call `linkInvitedUser` to check for pending invitations and link them to the new user's account.

### 2.4. Email Sending Utility

Create a new utility file `backend/database/utils/email.js` to centralize email sending functionality. This utility will contain functions like `sendInvitationEmail` and `sendPasswordResetEmail`.

### 2.5. Election Filtering Logic

Modify the `getElections` controller in `backend/controllers/elections/getElection.js` to filter the list of elections sent to the frontend. Admins will receive all elections, while normal users will receive public elections and those they are eligible for (using `fetchPublicAndEligibleElections`).

### 2.6. Create Cron Job for Election Status

Create a new file `backend/jobs/updateElectionStatus.js`. This will be a simple script that runs periodically (e.g., using `node-cron`) to find elections where `start_date` has passed and the `status` is still `upcoming`, and update their status to `active`.

### 2.7. Create `startElection` Controller

Create a new file `backend/controllers/elections/startElection.js` with a function that allows an admin to manually change an election's status from `upcoming` to `active`.

### 2.8. Update `electionRoutes.js`

Add a new `PUT` or `POST` route to `backend/routes/electionRoutes.js` for the `startElection` controller, and a new GET route for `isEligible`.

## 3. Frontend

### 3.1. Update `ElectionCreationForm` Component

Modify `frontend/src/components/admin/electionCreationForm/ElectionCreationForm.tsx` to:
-   Remove the `isPublic` switch.
-   Add a dropdown or radio button group to select the election `type` (`public`, `private`, `invite-only`).
-   Show UI elements to define `kyc_required`, `age_restriction`, and `regions`.
-   Show a text area or file upload for a list of emails.
-   Provide feedback on failed invitations for `invite-only` elections.

### 3.2. Update `ElectionDetails` Page

Modify `frontend/src/pages/ElectionDetails.tsx` to:
-   Display the election's type (`Public`, `Private`, `Invite-Only`) and its associated eligibility criteria.
-   Disable the vote button for ineligible users by passing an `isEligible` prop to `CandidateList` and `CandidateDetailDialog`.

### 3.3. Update `AdminDashboard` Component

In `frontend/src/pages/AdminDashboard.tsx`, for elections with an `upcoming` status, add a "Start Now" button that calls the new `startElection` endpoint.

### 3.4. Election Listing Visuals

Update the election listing components (`frontend/src/components/dashboard/ElectionTabs.tsx`, `frontend/src/components/dashboard/ElectionsGrid.tsx`, `frontend/src/components/dashboard/ElectionCard.tsx`) to:
-   Filter blockchain data based on the backend's filtered list of eligible/public elections.
-   Visually distinguish between public, private, and invite-only elections using badges or icons on the `ElectionCard`.
