const express = require('express');
const router = express.Router();
const {
  addUser,
  addProfile,
  getUsers,
  searchUsers,
  updateProfile,
  deleteProfile
} = require('../controllers/userController');
const {
  validateUser,
  validateProfile,
  validateProfileUpdate
} = require('../validators/userValidators');
const { validateRequest } = require('../middleware/validateRequest');

router.post('/add-user', validateUser, validateRequest, addUser);
router.post('/add-profile/:userId', validateProfile, validateRequest, addProfile);
router.get('/get-users', getUsers);
router.get('/search', searchUsers);
router.put(
  '/update-profile/:userId/:profileName', 
  validateProfileUpdate, 
  validateRequest, 
  updateProfile
);
router.delete('/delete-profile/:userId/:profileName', deleteProfile);

module.exports = router;