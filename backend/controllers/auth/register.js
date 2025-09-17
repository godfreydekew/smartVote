require('dotenv').config();
const { createUser } = require('../../database/queries/userQueries.js');
const { linkInvitedUser } = require('../../database/queries/elections/linkInvitedUser.js');
const { addUserToEligibleElections } = require('../../database/queries/elections/addUserToEligibleElections.js');
const bcrypt = require('bcrypt');
const yup = require('yup');

const createUserSchema = yup.object().shape({
  email: yup.string().email().required('Enter valid email address'),
  password: yup.string().required('Missing password'),
  full_name: yup.string().required('Missing Full name'),
  age: yup.number().integer().positive().optional(),
  gender: yup.string().optional(),
  countryOfResidence: yup.string().optional(),
});

const postUser = async (req, res) => {
  const { email, password, full_name, age, gender, countryOfResidence } = req.body;
  console.log(`register.js: Received registration request for email: ${email}`);

  try {
    await createUserSchema.validate(
      { email, password, full_name, age, gender, countryOfResidence },
      { abortEarly: false }
    );

    console.log(`register.js: ashing password for: ${email}`);
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    
    console.log(`register.js: Creating user in database for: ${email}`);
    const user = await createUser(
      email,
      hashedPassword,
      full_name,
      age,
      gender,
      countryOfResidence
    );

    console.log(`register.js: Checking for eligible elections for new user: ${user.id}`);
    await addUserToEligibleElections(user);

    console.log(`register.js: Checking for pending invitations for new user: ${user.id}`);
    await linkInvitedUser(user.id, user.email);

    console.log(`register.js: User registration successful for: ${email}`);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(`register.js: User registration failed for ${email}:`, error.message);
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }

    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    res.status(500).json({ 
      error: 'Error creating user', 
      details: error.message 
    });
  }
};

module.exports = { postUser };