const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: { type: String, required: true, index: true },
    expires: { type: Date, expires: 60 }
  },
  {
    timestamps: true
  }
);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
