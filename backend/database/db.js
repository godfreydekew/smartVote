//db.js
require('dotenv').config();
const { Pool } = require("pg");

const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;


const pool = new Pool({
  user: user,
  host: host,
  database: "newdb",
  password: password,
  port: 5432,
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