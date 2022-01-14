const mongoose = require('mongoose');
const userSeeder = require('./seeders/userSeeder');
const groupSeeder = require('./seeders/groupSeeder');

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/riktam';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
module.exports = {
  seedersList: {
      userSeeder,
      groupSeeder
  },
  connect: async () =>
      await mongoose.connect(mongoURL, { useNewUrlParser: true }),
  dropdb: async () => mongoose.connection.db.dropDatabase()
}
