const { body } = require('express-validator');
const validator = require('validator');

exports.validateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.validateProfile = [
  body('profileName')
    .trim()
    .notEmpty().withMessage('Profile name is required')
    .isIn(['fb', 'twitter', 'github', 'instagram']).withMessage('Profile name must be fb, twitter, github, or instagram'),
    
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .custom(value => validator.isURL(value)).withMessage('Please provide a valid URL')
];

exports.validateProfileUpdate = [
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .custom(value => validator.isURL(value)).withMessage('Please provide a valid URL')
];