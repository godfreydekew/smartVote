const bcrypt = require('bcrypt');
const yup = require('yup');

const { saveSessionData } = require('../utils/session.js');
const { getUserByEmail } = require('../../database/queries/userQueries.js');
const { linkInvitedUser } = require('../../database/queries/elections/linkInvitedUser.js');
const { startKYCSession } = require('../utils/kycService.js');

const loginSchema = yup.object().shape({
  email: yup.string('Email should be a string').email('Not a valide email').required('Email is required'),
  password: yup.string('Password should be a string').required('Password is required')
});

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email, password });

  try {
    await loginSchema.validate({ email, password }, { abortEarly: true });
    const user = await getUserByEmail(email);
    console.log('User found:', user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check for pending invitations and link them to the new user account
    await linkInvitedUser(user.id, user.email);

    console.log('User found:', user.id);
    // If user has an existing KYC session, reuse it
    // if (user.kyc_session_id) {
    //   req.session.kycSessionId = user.kyc_session_id;
    //   saveSessionData(req, user);
    //   return res.status(200).json({ user, kycUrl: null });
    // }
    
    // Otherwise, start a new KYC session via DIDit API
    // const kycSession = await startKYCSession(user.id);
    // req.session.kycSessionId = kycSession.session_id;
    saveSessionData(req, user);

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { login };
