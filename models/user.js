const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  notes: String,
  postingLink: String,
  status: {
    type: String,
    enum: ['interested', 'applied', 'interviewing', 'rejected', 'accepted']
  }
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  applications: [ applicationSchema ]
});

const User = mongoose.model("User", userSchema);

userSchema.pre('save', function (next) {
  const docToBeSaved = this
  if (docToBeSaved.username) {
    docToBeSaved.username = docToBeSaved.username[0].toUpperCase() + docToBeSaved.username.slice(1);
  }
  next();
});

module.exports = User;
