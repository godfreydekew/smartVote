
# Implementation Guide: Anonymous Voting with Merkle Trees

## 1. Introduction

This document provides a step-by-step guide for implementing the anonymous voting system described in the design document.

## 2. Prerequisites

*   Node.js and npm installed
*   Foundry installed
*   A running PostgreSQL instance

## 3. Backend Implementation

### 3.1. Installation

1.  Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2.  Install the required dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory and add the following environment variables:

    ```
    DB_USER=your_database_user
    DB_HOST=your_database_host
    DB_DATABASE=your_database_name
    DB_PASSWORD=your_database_password
    DB_PORT=your_database_port
    ```

### 3.2. Database Migrations

1.  Run the following command to create the `elections` table:

    ```bash
    node database/migrations/createTables.js
    ```

2.  Run the following command to add the `merkle_root` column to the `elections` table:

    ```bash
    node database/migrations/addMerkleRootToElections.js
    ```

3.  Run the following command to create the `election_voters` table:

    ```bash
    node database/migrations/createElectionVotersTable.js
    ```

### 3.3. Running the Backend

1.  Run the following command to start the backend server:

    ```bash
    npm start
    ```

## 4. Smart Contract Implementation

### 4.1. Compilation

1.  Navigate to the `blockchain` directory:

    ```bash
    cd blockchain
    ```

2.  Install the required dependencies:

    ```bash
    npm install
    ```

3.  Compile the smart contracts:

    ```bash
    forge build
    ```

### 4.2. Deployment

1.  Deploy the `VotingFactory.sol` contract to your preferred Ethereum network.
2.  Take note of the deployed contract address.

## 5. Frontend Implementation

### 5.1. Installation

1.  Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2.  Install the required dependencies:

    ```bash
    npm install
    ```

### 5.2. Configuration

1.  In the `frontend/src/api/config.ts` file, update the `CONTRACT_ADDRESS` variable with the address of the deployed `VotingFactory.sol` contract.

### 5.3. Running the Frontend

1.  Run the following command to start the frontend server:

    ```bash
    npm run dev
    ```
