var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var salt = 'mylove';

var UserSchema = new mongoose.Schema({
  username: {
  	type: String,
  	unique: true
  },
  email: {
  	type: String,
  	ubique: true
  },
  password: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.pre('save', function(next) {
  var newUser = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if(err) return next(err);
      newUser.password = hash;
      next();
    })
  })
})

UserSchema.methods = {
  comparePassword: function(_password, callback) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if(err) {
        return callback(err);
      }
      callback(null, isMatch);
    })
  }
}

module.exports = UserSchema;