const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  })
  return newObj
}

exports.getMe = (req, res, next) => {
  try {
    req.params.id = req.user.id
  } catch (error) {}
  next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'username', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.signupSimple = catchAsync(async (req, res, next) => {
  const doc = await User.create({
    username: req.body.username,
    email: req.body.email,
    telefone: req.body.telefone,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  })
})

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updatePerfil = async (req, res) => {
const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
  runValidators: true
})

res.status(200).json({
  status: 'success',
  data: {
    user: doc
  }
})
}
