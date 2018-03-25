var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        lowercase:true,
        unique:true,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpwd: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                } else {
                    user.password = hash;
                    next();
                }
            })
             bcrypt.hash(user.confirmpwd, salt, function(err, hash) {
                if (err) {
                    return next(err);
                } else {
                    user.confirmpwd = hash;
                    next();
                }
            })

        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(pwd, CB) {
    bcrypt.compare(pwd, this.password, function(err, isMatch) {
        if (err) {
            return CB(err);
        };
        CB(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);