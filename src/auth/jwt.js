const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.SECRET;
const validateJwt = expressJwt({ secret: jwtSecret });
const logger = require('./../utils/logger');
const redis = require('./../utils/redis');
const { NotAuthorizedError, ServerError } = require('./../utils/errorHandlers');

exports.jwtEnsure = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new NotAuthorizedError());
    }

    const isBlackListedToken = await redis.get(JSON.stringify(req.user));
    if (isBlackListedToken) {
      logger.error(`${req.user._id} tried blacklisted token`);
      return next(new NotAuthorizedError());
    }

    const updatedAt = await redis.get(req.user._id);

    if (updatedAt && req.user) {
      const lastPasswordUpdate = Math.floor((new Date(updatedAt) * 1) / 1000);
      if (lastPasswordUpdate >= req.user.iat) {
        const blacklisted = await this.blacklistToken(req.user);
        if (!blacklisted) {
          return next(new Error('Unable to blacklist token.'));
        }
        return next(new NotAuthorizedError());
      }
    }
    next();
  } catch (err) {
    return next(new ServerError());
  }
};

exports.jwtCheck = (req, res, next) => validateJwt(req, res, () => next());

exports.allowRoles = roles => (req, res, next) => {
  const allowAccess = roles.some(role => req.user.roles.includes(role));
  if (!allowAccess) {
    return next(new NotAuthorizedError());
  }

  return next();
};

exports.signToken = (user) => {
  const data = {
    _id: user._id,
    roles: user.roles,
    ts: new Date().getTime()
  };

  const expiresIn = parseInt(process.env.TOKEN_EXPIRES_IN_SECONDS, 10);

  return jwt.sign(data, jwtSecret, { expiresIn });
};

exports.blacklistToken = async user =>
  redis.set(JSON.stringify(user), user._id, user.exp - user.iat);
