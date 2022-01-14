const mongoose = require('mongoose');
const schema = mongoose.Schema;

const member = new schema({
    phone: {
        type: String,
        minlength: [10, "Phone Number must be longer than 9 characters"],
        unique: true
    },
});

const user = new schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phone: {
        type: String,
    },
    _id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

const message = new schema(
    {
        message: {
            type: String,
            required: true
        },
        isLiked: {
            type: Boolean,
        },
        sentBy: {
            type: user,
            required: true
        },
    },
    {
        timestamps: true,
    });

const group = new schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        members: [{
            type: member,
            required: true,
        }],
        messages: [{
            type: message,
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    })

const Group = mongoose.model("Group", group);
module.exports = Group;