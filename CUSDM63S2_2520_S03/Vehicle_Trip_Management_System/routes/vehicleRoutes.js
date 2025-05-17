const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
  addTrip,
  updateTrip,
  deleteTrip,
  getVehiclesWithLongTrips,
  getVehiclesFromMajorCities,
  getVehiclesWithRecentTrips,
  getCarsAndTrucks,
  getTotalDistance
} = require('../controllers/vehicleController');

// Vehicle CRUD routes
router.post('/', createVehicle);
router.get('/', getVehicles);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

// Trip operations routes
router.post('/:id/trips', addTrip);
router.put('/:vehicleId/trips/:tripId', updateTrip);
router.delete('/:vehicleId/trips/:tripId', deleteTrip);

// Advanced query routes
router.get('/long-trips', getVehiclesWithLongTrips);
router.get('/major-cities', getVehiclesFromMajorCities);
router.get('/recent-trips', getVehiclesWithRecentTrips);
router.get('/cars-trucks', getCarsAndTrucks);

// Bonus route
router.get('/:id/total-distance', getTotalDistance);

module.exports = router;