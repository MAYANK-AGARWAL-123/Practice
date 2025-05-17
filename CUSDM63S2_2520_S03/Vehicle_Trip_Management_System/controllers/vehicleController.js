const Vehicle = require('../models/Vehicle');

// Vehicle CRUD Operations

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

exports.getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (err) {
    next(err);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Trip Operations

exports.addTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $push: { trips: req.body } },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { 
        _id: req.params.vehicleId,
        'trips._id': req.params.tripId 
      },
      { 
        $set: { 
          'trips.$': req.body 
        } 
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle or trip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.vehicleId,
      { $pull: { trips: { _id: req.params.tripId } } },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle or trip not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

// Advanced Queries

exports.getVehiclesWithLongTrips = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({
      'trips.distance': { $gt: 200 }
    });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (err) {
    next(err);
  }
};

exports.getVehiclesFromMajorCities = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({
      'trips.startLocation': { $in: ['Delhi', 'Mumbai', 'Bangalore'] }
    });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (err) {
    next(err);
  }
};

exports.getVehiclesWithRecentTrips = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({
      'trips.startTime': { $gte: new Date('2024-01-01') }
    });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (err) {
    next(err);
  }
};

exports.getCarsAndTrucks = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({
      type: { $in: ['car', 'truck'] }
    });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (err) {
    next(err);
  }
};

// Get total distance for a vehicle
exports.getTotalDistance = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    const totalDistance = vehicle.totalDistance();
    
    res.status(200).json({
      success: true,
      data: {
        registrationNumber: vehicle.registrationNumber,
        totalDistance
      }
    });
  } catch (err) {
    next(err);
  }
};