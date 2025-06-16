require('dotenv').config();
const { createUser } = require('../../database/queries/userQueries.js');
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

  try {
    await createUserSchema.validate(
      { email, password, full_name, age, gender, countryOfResidence },
      { abortEarly: false }
    );

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    const user = await createUser(
      email,
      hashedPassword,
      full_name,
      age,
      gender,
      countryOfResidence
    );

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
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
