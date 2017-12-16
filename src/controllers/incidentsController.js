const HTTPStatus = require('http-status');
const Incident = require('../models/Incident');
const { IncidentMessage } = require('../constants/messages');
const { Error } = require('./../utils/errorHandlers');
const { isMongoObjectId } = require('../utils/validator');

exports.getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find({});
    if (!incidents) {
      throw new Error(IncidentMessage.INCIDENTS_NOT_FOUND);
    }

    res.status(HTTPStatus.OK).json(incidents);
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
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      throw new Error(IncidentMessage.INCIDENT_NOT_FOUND);
    }

    res.status(HTTPStatus.OK).json(incident);
  } catch (err) {
    next(err);
  }
};

exports.createNewIncident = async (req, res, next) => {
  try {
    const {
      assetId,
      title,
      description
    } = req.body;
    if (!isMongoObjectId(assetId)) {
      throw new Error(IncidentMessage.INCIDENT_CREATE_FAIL);
    }

    const incident = new Incident({
      asset: assetId,
      title,
      description
    });

    await incident.save();

    res.status(HTTPStatus.CREATED).send(IncidentMessage.INCIDENT_CREATED);
  } catch (err) {
    next(err);
  }
};
