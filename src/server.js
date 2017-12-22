require('dotenv').config({ path: '.env' });
require('./models/Room');
require('./models/User');
require('./models/DeviceStatus');
require('./models/DeviceType');

const logger = require('./utils/logger');
const app = require('./app');
const db = require('./db');

(async () => {
  try {
    await db.connectDatabase();

    const server = app.listen(app.get('port'), () => {
      logger.info(`Server started in ${process.env.NODE_ENV} mode, running on ${server.address().port}`);
    });

    process.on('uncaughtException', (err) => {
      logger.error(err);
    });

    process.on('unhandledRejection', (err, promise) => {
      logger.error(err);
    });

    process.on('SIGNINT', () => {
      db.connection.close(() => {
        logger.error('Database connection terminated!');
      });

      process.exit(0);
    });
  } catch (error) {
    logger.error(error);
  }
})();

module.exports = app;
