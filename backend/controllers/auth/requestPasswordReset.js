const { pool } = require('../../database/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

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

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

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
