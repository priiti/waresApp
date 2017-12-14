const Incident = require('../models/Incident');
const { IncidentMessage } = require('../constants/messages');
const { Error } = require('./../utils/errorHandlers');
const { isMongoObjectId } = require('../utils/validator');

exports.getIncidents = async (req, res, next) => {
  try {
    const incidents = Incident.find({});
    if (!incidents) {
      throw new Error(IncidentMessage.INCIDENTS_NOT_FOUND);
    }

    res.status(200).json(incidents);
  } catch (err) {
    next(err);
  }
};

exports.getIncidentById = async (req, res, next) => {
  try {
    const { incidentId } = req.params;
    if (!isMongoObjectId(incidentId)) {
      throw new Error(IncidentMessage.INCIDENT_NOT_FOUND);
    }
    const incident = Incident.findById(incidentId);
    if (!incident) {
      throw new Error(IncidentMessage.INCIDENT_NOT_FOUND);
    }

    res.status(200).json(incident);
  } catch (err) {
    next(err);
  }
};
