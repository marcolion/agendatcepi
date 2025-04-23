const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  requesterName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
