<div align="center">

# Smart Vote

### Decentralized Blockchain Voting Platform

[![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Foundry](https://img.shields.io/badge/Foundry-1C1C1C?logo=ethereum&logoColor=white)](https://book.getfoundry.sh/)

**Top 10 Finalist** — [Teknofest 2025](https://www.teknofest.org/en/season/2025) Blockchain Competition
The world's largest technology festival, with over 7,000 submissions in the blockchain category alone. Our project advanced to the top 10 and was presented at the finals in Istanbul, Turkey.

</div>

---

## The Problem

Today, more than 100 countries in the world depend on democracy. More than 70% of them rely on traditional paper voting, and a majority of elections are reportedly manipulated or subject to coercion. Additionally, running national elections remains expensive, as governments routinely spend millions of dollars on logistics, security, polling-station staff, and transportation of election materials.

However, using a blockchain‑based system eliminates most traditional voting barriers, as votes are recorded directly on the Ethereum network. In such a design, the primary way to manipulate results would be through a 51% attack, which is considered computationally and economically infeasible on a large public blockchain like Ethereum.

## How It Works

Smart Vote is a decentralized voting platform built on the Ethereum blockchain. It enables organizations and governments to create secure, transparent, and tamper-proof elections. Each election is deployed as its own Ethereum smart contract, and every vote is recorded as an Ethereum transaction. The system integrates KYC identity verification to ensure only eligible registered users can participate.

## Features

- **One contract per election** — each election is isolated in its own smart contract, preventing cross-contamination
- **Immutable vote records** — every ballot is an Ethereum transaction; once cast, it cannot be altered or deleted
- **Identity verification** — integrated with [didit](https://docs.didit.me/reference/introduction) for KYC, with optional age and region restrictions
- **Public, private & invite-only elections** — flexible visibility and access controls for any use case
- **Two-phase elections** — registration phase followed by an active voting phase, with admin override to start early
- **Real-time analytics** — live dashboards with voter turnout, demographic breakdowns, and results

## Architecture

- **Frontend:** Vite + React + TypeScript + Thirdweb (located in `/frontend`)
- **Backend:** Express.js + PostgreSQL (located in `/backend`)
- **Blockchain:** Solidity smart contracts, deployed and managed with Thirdweb and Foundry (located in `/blockchain`)

## Getting Started

### 1. Clone & install

```sh
git clone https://github.com/godfreydekew/smartVote.git
cd smartVote
chmod +x build.sh
./build.sh
```

### 2. Configure environment

This project requires `.env` files for both frontend and backend. If you need access, reach out at **dekewgodfrey@gmail.com**.

### 3. Start the backend

> Make sure your PostgreSQL database is created and the credentials match your `.env` file.

```sh
cd backend
nodemon
```

### 4. Start the frontend

```sh
cd frontend
yarn dev
```
