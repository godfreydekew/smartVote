#!/bin/bash

echo "Starting Smart vote build process"

echo "-------------------------------------------------------------------"
echo "Installing backend dependencies..."
cd backend
if [ ! -f .env ]; then
    touch .env
    cp .env.example .env
fi

cp .env.example .env
npm install
echo "-------------------------------------------------------------------"

echo "Installing frontend dependencies..."
cd ../frontend
if [ ! -f .env ]; then
    touch .env
    cp .env.example .env
fi

npm install --legacy-peer-deps
echo "Installing frontend dependencies completed"