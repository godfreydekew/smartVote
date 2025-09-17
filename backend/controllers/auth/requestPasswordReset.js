const { pool } = require('../../database/db');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../../database/utils/email');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  console.log('Password reset request for email:', email);

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required'
    });
  }

  const client = await pool.connect();

  try {
    // Check if user exists
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email address'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour

    // Store reset token in database
    await client.query(
      'INSERT INTO forget_password (user_email, reset_token, expiry_date) VALUES ($1, $2, $3)',
      [email, resetToken, expiryDate]
    );

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    console.error('Error in password reset request:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset request'
    });
  } finally {
    client.release();
  }
};

module.exports = { requestPasswordReset };
