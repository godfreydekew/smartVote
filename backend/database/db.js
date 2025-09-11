require('dotenv').config({ path: './backend/.env' });
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log("Database connection successful!");
    client.release();
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

checkDatabaseConnection();
module.exports = { pool, checkDatabaseConnection };