const { pool } = require('../db');
const { DatabaseError } = require('../utils/errors');

async function getUserById(userId) {
  console.log(`userQueries: Fetching user with ID: ${userId}`);
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    console.log(`userQueries: User found with ID: ${userId}`);
    return result.rows[0];
  } catch (error) {
    console.error(`userQueries: Error fetching user with ID ${userId}:`, error.message);
    throw new DatabaseError('Error fetching user: ' + error.message);
  }
}

async function getUserByEmail(email) {
  console.log(`userQueries: Fetching user with email: ${email}`);
  try {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log(`userQueries: User found with email: ${email}`);
    return result.rows[0];
  } catch (error) {
    console.error(`userQueries: Error fetching user by email ${email}:`, error.message);
    throw new DatabaseError('Error fetching user by email: ' + error.message);
  }
}

async function createUser(email, password,  full_name, age, gender, countryOfResidence) {
  console.log(`userQueries: Attempting to create user with email: ${email}`);
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, full_name, age, gender, country_of_residence)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [email, password,  full_name, age, gender, countryOfResidence]
    );
    console.log(`userQueries: User created successfully with email: ${email}`);
    return result.rows[0];
  } catch (error) {
    console.error(`userQueries: Error creating user with email ${email}:`, error.message);
    if (error.code === '23505') {
      throw new DatabaseError('Email already exists', 'DUPLICATE_EMAIL');
    }
    throw new DatabaseError('Error creating user: ' + error.message);
  }
}

async function updateUserRole(userId, newRole) {
  console.log(`userQueries: Attempting to update role for user ID ${userId} to ${newRole}`);
  try {

    const result = await pool.query(
      `UPDATE users SET user_role = $1 WHERE id = $2 RETURNING id, email, user_role`,
      [newRole, userId]
    );

    if (result.rows.length === 0) {
      throw new DatabaseError('User not found', 'USER_NOT_FOUND');
    }

    console.log(`userQueries: Successfully updated role for user ID ${userId}`);
    return result.rows[0];
  } catch (error) {
    console.error(`userQueries: Error updating role for user ID ${userId}:`, error.message);
    if (error.code === '22003') { 
        throw new DatabaseError('Invalid user role', 'INVALID_USER_ROLE');
    }
    throw new DatabaseError('Error updating user role: ' + error.message);
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUserRole
};
