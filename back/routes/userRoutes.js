const router = require('express').Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const { validateUserData } = require('../middlewares/validation');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/check', authController.checkUser);
router.patch(
  '/update_password',
  authController.protect,
  authController.updatePassword
);

// ==============================================
router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAllUsers
);
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  validateUserData,
  userController.createUser
);

router.route('/:id').get(userController.getUserById);
router.route('/:id').patch(userController.updateUser);

module.exports = router;
