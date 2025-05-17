const { validationResult } = require('express-validator');

exports.validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      errors: errorMessages
    });
  };
};