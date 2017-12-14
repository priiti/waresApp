const mongoose = require('mongoose');
const { incidentStatus, incidentPriority } = require('../constants/status');

const incidentSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    incidentStatus: {
      type: String,
      enum: Object.values(incidentStatus),
      default: incidentStatus.OPEN
    },
    incidentPriority: {
      type: String,
      enum: Object.values(incidentPriority),
      default: incidentPriority.NORMAL
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deletedAt: { type: Date, default: null }
  },
  {
    collection: 'incident'
  }
);

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
