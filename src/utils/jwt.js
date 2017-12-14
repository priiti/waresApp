const { NotAuthorizedError } = require('./../utils/errorHandlers');

exports.allowRoles = roles => (req, res, next) => {
  const allowAccess = roles.some(role => req.user.roles.includes(role));
  if (!allowAccess) {
    return next(new NotAuthorizedError());
  }

  return next();
};
