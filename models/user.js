const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const user = new schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            minlength: [10, "Phone Number must be longer than 9 characters"],
            unique: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        },
        password: {
            type: String,
            default: "Riktam@Riktam",
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    })

    user.pre('save', function (next) {
        let model = this
        let saltRounds = 5
    
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(model.password, salt, null, function (err, hash) {
                if (err) return next(err)
                model.password = hash;
                next()
            });
        });
    })

const User = mongoose.model("User", user);
module.exports = User;