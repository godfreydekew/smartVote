# Smart Vote: Blockchain Voting System

Smart Vote is a decentralized voting platform built on the Ethereum blockchain. It enables organizations and governments to create secure, transparent, and tamper-proof elections. Each election is deployed as a smart contract, and every vote is recorded as a blockchain transaction. The system integrates identity verification to ensure only eligible users can participate.

## Features
- **Decentralized Elections:** Each election is a unique smart contract on Ethereum.
- **Immutable Voting Records:** Every vote is a blockchain transaction, ensuring transparency and auditability.
- **Identity Verification:** Integrated with an identity verification [didit-API](https://docs.didit.me/reference/introduction) to confirm voter eligibility.
- **Modern Frontend:** Built with Vite, TypeScript, and [Thirdweb](https://portal.thirdweb.com/) for seamless blockchain interaction.
- **Secure Backend:** Powered by Express and PostgreSQL for API and data management.

## Architecture
- **Frontend:** Vite + React + TypeScript + Thirdweb (located in `/frontend`)
- **Backend:** Express.js + PostgreSQL (located in `/backend`)
- **Blockchain:** Solidity smart contracts, deployed and managed with Thirdweb and Foundry (located in `/blockchain`)

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Foundry](https://book.getfoundry.sh/) (for blockchain development)
- [PostgreSQL](https://www.postgresql.org/) (for backend database)

## Environment Variables
This project requires environment variable files for both the frontend and backend to function correctly. If you need access to these files, please send an email to dekewgodfrey@gmail.com.

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/godfreydekew/smartVote.git
cd smartVote
```
### 2. Install dependencies && configure .env
```sh
chmod +x build.sh
./build.sh
```

### 2. Setup the Backend
### ! Create Postgres db and update credentials in .env file
```sh
cd backend
nodemon
```

### 3. Setup the Frontend
```sh
cd frontend
yarn dev
```
