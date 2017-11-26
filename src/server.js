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
    const server = app.listen(app.get('port'), () => {
      logger.info(`Server running on ${server.address().port}`);
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
