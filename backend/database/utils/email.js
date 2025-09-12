const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendInvitationEmail(email, election) {
  const mailOptions = {
    from: process.env.SMTP_FROM, 
    to: email,
    subject: `You have been invited to vote in the election: ${election.title}`,
    html: `
      <h1>You have been invited to vote!</h1>
      <p>You have been invited to vote in the election: <strong>${election.title}</strong>.</p>
      <p>The election starts on ${new Date(election.start_date).toLocaleDateString()} and ends on ${new Date(election.end_date).toLocaleDateString()}.</p>
      <p>Please log in to the platform to cast your vote.</p>
      <a href="${process.env.FRONTEND_URL}/login">Go to SmartVote</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending invitation email to ${email}:`, error);
  }
}

async function sendPasswordResetEmail(email, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: process.env.SMTP_FROM, 
        to: email,
        subject: 'Password Reset Request',
        html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending password reset email to ${email}:`, error);
    }
}

module.exports = {
  sendInvitationEmail,
  sendPasswordResetEmail,
};
