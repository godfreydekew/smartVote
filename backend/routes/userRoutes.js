const express = require('express');
const router = express.Router();
const authenticateSession = require('../middleware/authenticateSession.js');

//auth
const { login } = require('../controllers/auth/login.js');
const { logout } = require('../controllers/auth/logout.js');
const { postApplyAdmin } = require('../controllers/auth/applyadmin.js');
const { postUser } = require('../controllers/auth/register.js')
const { checkSession } = require('../controllers/auth/validateUser.js');
const { requestPasswordReset } = require('../controllers/auth/requestPasswordReset.js');
const { resetPassword } = require('../controllers/auth/resetPassword.js');
//user
const { getUserByIdController } = require('../controllers/users/getUser.js');
const {  deleteUser } = require('../controllers/users/deleteUser.js');
const { getUserByEmailController } = require('../controllers/users/getUser.js');
const { updateUserController } = require('../controllers/users/updateUser.js');


router.post('/login', login);
router.post('/logout', logout);
router.get('/check-session', checkSession);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.post('/create', postUser);
router.get('/:userId', getUserByIdController);
router.get('/', authenticateSession, getUserByEmailController);
router.put('/:userId', updateUserController);
router.delete('/', authenticateSession, deleteUser);


router.post('/apply-admin', authenticateSession, postApplyAdmin);



module.exports = router;
