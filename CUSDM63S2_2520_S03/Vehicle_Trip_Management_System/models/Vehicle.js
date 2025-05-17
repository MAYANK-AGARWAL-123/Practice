const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  startLocation: {
    type: String,
    required: [true, 'Start location is required']
  },
  endLocation: {
    type: String,
    required: [true, 'End location is required']
  },
  distance: {
    type: Number,
    required: [true, 'Distance is required'],
    min: [0.1, 'Distance must be greater than 0']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(value) {
        return value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  }
});

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: {
      values: ['car', 'truck', 'bike'],
      message: 'Vehicle type must be car, truck, or bike'
    }
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  trips: [tripSchema]
}, { timestamps: true });

// Custom instance method to calculate total distance
vehicleSchema.methods.totalDistance = function() {
  return this.trips.reduce((total, trip) => total + trip.distance, 0);
};

module.exports = mongoose.model('Vehicle', vehicleSchema);