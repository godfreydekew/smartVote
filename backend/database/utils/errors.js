// utils/errors.js
class DatabaseError extends Error {
  constructor(message, code = 'DATABASE_ERROR') {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
  }
}

// Map PostgreSQL error codes to custom messages and codes
const pgErrorCodeMap = {
  '23502': ['Null value in column violates not-null constraint', 'NULL_VALUE_VIOLATION'],
  '23514': ['Check constraint violation', 'CHECK_CONSTRAINT_VIOLATION'],
  '23505': ['Unique violation', 'UNIQUE_VIOLATION'],
  '23514': ['Invalid data input', 'INVALID_DATA_INPUT'],
  '42601': ['Syntax error in SQL query', 'SQL_SYNTAX_ERROR'],
  '08003': ['Database connection error', 'DB_CONNECTION_ERROR'],
  '08006': ['Database connection failure', 'DB_CONNECTION_FAILURE'],
  '08000': ['Database connection exception', 'DB_CONNECTION_EXCEPTION'],
  '08001': ['Client unable to establish connection', 'CLIENT_CONNECTION_ERROR'],
  '08002': ['Connection already open', 'CONNECTION_ALREADY_OPEN'],
  '08004': ['Server rejected the connection', 'SERVER_REJECTED_CONNECTION'],
  '08005': ['Connection failure', 'CONNECTION_FAILURE'],
  '08007': ['Protocol violation', 'PROTOCOL_VIOLATION'],
  '08008': ['Connection failure', 'CONNECTION_FAILURE'],
  '08009': ['Connection failure', 'CONNECTION_FAILURE'],
  '08010': ['Connection failure', 'CONNECTION_FAILURE'],

};

function handlePostgresError(error) {
  const [message, code] = pgErrorCodeMap[error.code] || [`Database error: ${error.message}`, 'DATABASE_ERROR'];
  return new DatabaseError(message, code);
}

module.exports = {
  DatabaseError,
  handlePostgresError
};
