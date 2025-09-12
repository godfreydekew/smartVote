# Implementation Guide: Private Elections and Phased Voting

This document provides a step-by-step guide to implementing the new private election and phased voting features.

## 1. Database Migration

### 1.1. Create a New Migration File

Create a new file `backend/database/migrations/add_election_type.js`.

### 1.2. Update `elections` Table

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

### 1.3. Update `eligible_voters` Table

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

### 1.4. Run the Migration

Create a script to run the migrations or manually apply them. For this project, we'll update `backend/index.js` to run the new migration functions.

```javascript
// backend/index.js

// ... (previous code)

const { updateElectionsTable, updateEligibleVotersTable } = require('./database/migrations/add_election_type.js');

// ... (previous code)

(async () => {
    await updateElectionsTable();
    await updateEligibleVotersTable();
})();


// ... (rest of the server startup code)
```
**Note:** Running migrations directly in the main application startup is not ideal for production but is acceptable for this project's current structure.

## 2. Backend

### 2.1. Update `postElection` Controller

Modify `backend/controllers/elections/postElection.js` to handle the new `type`, `kyc_required`, `age_restriction`, `regions`, and `invitedEmails` fields. The validation schema will also need to be updated.

### 2.2. Create `checkEligibility` Service

Create a new file `backend/services/checkEligibility.js`. This service will contain a function that checks if a newly registered user is eligible for any upcoming or active elections based on `kyc_required`, `age_restriction`, and `regions` and adds them to the `eligible_voters` table.

### 2.3. Update `register` Controller

Modify `backend/controllers/auth/register.js` to:
1.  After creating a new user, call the `checkEligibility` service.
2.  Check if the user's email exists in the `eligible_voters` table for any `invite-only` elections and update the `user_id` from `NULL` to the new user's ID.

### 2.4. Create Cron Job for Election Status

Create a new file `backend/jobs/updateElectionStatus.js`. This will be a simple script that runs periodically (e.g., using `node-cron`) to find elections where `start_date` has passed and the `status` is still `upcoming`, and update their status to `active`.

### 2.5. Create `startElection` Controller

Create a new file `backend/controllers/elections/startElection.js` with a function that allows an admin to manually change an election's status from `upcoming` to `active`.

### 2.6. Update `electionRoutes.js`

Add a new `PUT` or `POST` route to `backend/routes/electionRoutes.js` for the `startElection` controller.

## 3. Frontend

### 3.1. Update `ElectionCreationForm` Component

Modify `frontend/src/components/admin/electionCreationForm/ElectionCreationForm.tsx` to:
-   Remove the `isPublic` switch.
-   Add a dropdown or radio button group to select the election `type` (`public`, `private`, `invite-only`).
-   show UI elements to define `kyc_required`, `age_restriction`, and `regions`.
-   show a text area or file upload for a list of emails.

### 3.2. Update `ElectionDetails` Page

Modify `frontend/src/pages/ElectionDetails.tsx` to display the election's type (`Public`, `Private`, `Invite-Only`) and its associated eligibility criteria.

### 3.3. Update `AdminDashboard` Component

In `frontend/src/pages/AdminDashboard.tsx`, for elections with an `upcoming` status, add a "Start Now" button that calls the new `startElection` endpoint.