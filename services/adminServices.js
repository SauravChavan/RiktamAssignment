const User = require("../models/user");

const getAllUsers = async(userId) => {
    try {
        let users
        users = await User.find({createdBy: userId})
        return users
    } catch (ex) {
        console.log(ex);
    }
}

const addUser = async (adminId, data) => {
    try {
        let {
            firstName, lastName, phone
        } = data;
        if (!firstName || !lastName || !phone) {
            return {
                err: true,
                message: "Missing required fields",
            };
        }
        const existingUser = await User.findOne({ phone: data.phone });
        if (existingUser) {
            return {
                err: true,
                message: "User with same Phone Number already exists.",
            };
        }
        let user = new User({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            createdBy: adminId
        });
        user = await user.save();
        return user;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const updateUser = async (data) => {
    try {
        let user = await User.updateOne({phone: data.phone}, data);
        let updatedUser = await User.findOne({phone: data.phone})
        return updatedUser;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const deleteUser = async (data) => {
    try {
        if (!data.phone) {
            return {
                err: true,
                message: "Phone number required.",
            };
        }
        let user = await User.findOne({phone: data.phone});
        if (user==null) {
            return {
                err: true,
                message: "User with Phone Number " + data.phone + " does not exists.",
            };
        }
        User.deleteOne({phone: data.phone}, (err) => {
            if (err) {
                return ({
                    error: "Failed to delete the product"
                })
            }
            
        })
        return {success: true}
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

module.exports = {
    getAllUsers, addUser, updateUser, deleteUser
}