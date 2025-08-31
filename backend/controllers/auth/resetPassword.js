const { pool } = require('../../database/db');
const bcrypt = require('bcrypt');

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  console.log("Resetting password for token:", token);

  if (!token || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Token and new password are required'
    });
  }

  const client = await pool.connect();

  try {
    // Find the reset token and check if it's valid
    const tokenResult = await client.query(
      'SELECT user_email, expiry_date FROM forget_password WHERE reset_token = $1',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }

    const { user_email, expiry_date } = tokenResult.rows[0];

    // Check if token has expired
    if (new Date() > new Date(expiry_date)) {
      // Delete expired token
      await client.query('DELETE FROM forget_password WHERE reset_token = $1', [token]);

      return res.status(400).json({
        status: 'error',
        message: 'Reset token has expired'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, user_email]);

    // Delete the used token
    await client.query('DELETE FROM forget_password WHERE reset_token = $1', [token]);

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Error in password reset:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password'
    });
  } finally {
    client.release();
  }
};

module.exports = { resetPassword };
