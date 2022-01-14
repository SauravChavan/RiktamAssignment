const User = require("../models/user");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const login = async (data) => {
    try {
        let {
            phone,
            password,
        } = data;
        if (!phone || !password) {
            return {
                message: "Missing required fields",
            };
        }
        const user = await User.findOne({ phone: phone })
        if (!user)
            return {
                err: true,
                message: "No user found!",
            };

        if (user.inviteToken !== null) {
            user.inviteToken = null;
            user.save();
        }
        const result = await bcrypt.compareSync(password, user.password);
        if (result) {
            const token = jwt.sign(
                {
                    id: user.phone,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                config.jwtSecret
            );
            return {
                message: "ok",
                token: token,
                user: user
            };
        } else {
            return {
                err: true,
                message: "Bad password",
            };
        }
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const updatePassword = async (user, data) => {
    let result
    result = await User.findOneAndUpdate({phone: user.phone}, {password: data.newPassword})
    result = await result.save()
    return result;
}

module.exports = {
    login, updatePassword,
}