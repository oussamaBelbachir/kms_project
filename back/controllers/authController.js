const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // sameSite: 'none',
    // secure: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  user.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // ======================================================================================
  if (!email || !password) {
    return next(new AppError('Please provide Email and Password !!', 400));
  }
  // ======================================================================================

  //  Check if user exists && pass is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }

  if (!user.active) {
    return next(new AppError('Votre compte est désactivé', 401));
  }
  // ======================================================================================

  // if everthing correct
  createSendToken(user, 201, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 500),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;

  // ===============================================================================================================
  if (!token) {
    return next(
      new AppError('Your are not logged in! Please log in to get access !!'),
      401
    );
  }
  // ===============================================================================================================

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  req.user = currentUser;
  next();
});

exports.checkUser = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(200).json({
      status: 'success',
      data: {
        user: null,
      },
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  return res.status(200).json({
    status: 'success',
    data: {
      user: currentUser,
    },
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Vous n'êtes pas autorisé à effectuer cette action`, 403)
      );
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Votre mot de passe actuel est incorrect', 401));
  }

  if (password !== confirmPassword) {
    return next(new AppError('Confirmation de mot de passe invalide', 401));
  }

  user.password = password;
  user.passwordConfirm = confirmPassword;
  await user.save();

  // if everthing correct
  return res.status(200).json({
    status: 'success',
    message: 'Votre mot de passe à été modifié avec succès',
  });
});
