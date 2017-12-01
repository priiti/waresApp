const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileImage: { type: String, default: '' },
  phoneNumber: { type: String, required: true },
  login: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date, default: null }
}, {
  collection: 'users'
});

const User = mongoose.model('User', userSchema);
module.exports = User;
