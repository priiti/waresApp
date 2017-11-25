require('dotenv').config({ path: '.env' });
const app = require('./app');
const db = require('./db');

const server = app.listen(app.get('port'), () => {
  console.log(`Server running on ${server.address().port}`);

  process.on('SIGINT', () => {
    db.connection.close(() => {
      console.log('Database connection terminated!');
      process.exit(0);
    });
  });
});
