const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileImage: { type: String, default: '' },
  phoneNumber: { type: String, required: true },
  login: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordUpdatedAt: { type: Date, default: null }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date, default: null }
}, {
  collection: 'users',
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

/**
 * Salt and hash password before saving the user
 */
userSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (!user.isModified('login.password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.login.password, salt);
    user.login.password = hash;

    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Validate user given password with salted/hashed password
 */
userSchema.methods.validatePasswords = function (userGivenPassword) {
  return bcrypt.compare(userGivenPassword, this.login.password);
};

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
