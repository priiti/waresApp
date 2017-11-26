const SubclassError = require('subclass-error');

const isProduction = process.env.NODE_ENV === 'production';

exports.Error = SubclassError('Error', { status: 400, message: 'Bad request' });

exports.NotAuthorizedError = SubclassError('NotAuthorizedError', { status: 401, message: 'Unauthorized' });
exports.ForbiddenError = SubclassError('ForbiddenError', { status: 403 });
exports.NotFoundError = SubclassError('NotFoundError', { status: 404 });
exports.UnprocessableEntityError = SubclassError('UnprocessableEntityError', { status: 422 });
exports.ServerError = SubclassError('ServerError', { status: 500, message: 'Server error' });

exports.notFound = (req, res) => res.status(404).send('Not Found');
exports.errorHandler = (err, req, res, next) => res.status(err.status || 500).json({
  message: err.message,
  errors: err.errors || undefined,
  stack: isProduction ? undefined : err.stack
});
