require('dotenv').config({ path: '.env' });

require('./models/Room');
require('./models/User');
require('./models/DeviceStatus');
require('./models/DeviceType');

const app = require('./app');
const db = require('./db');

(async () => {
  try {
    const server = app.listen(app.get('port'), () => {
      console.log(`Server running on ${server.address().port}`);
    });

    process.on('SIGNINT', () => {
      db.connection.close(() => {
        console.log('Database connection terminated!');
      });

      process.exit(0);
    });
  } catch (error) {
    console.error(error);
  }
})();
