const router = require("express").Router();
const adminServices = require("../services/adminServices");
const passport = require('passport');

router.get("/", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            if (req.user.isAdmin) {
                let users = await adminServices.getAllUsers(req.user.id);
                res.status(200).json({ 
                    "All Users": users
                })
            } else {
                throw {
                    message: "RESTRICTED"
                }
        }} else {
            throw {
                message: "NOT LOGGED IN"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
});

router.post("/add", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            if (req.user.isAdmin) {
            let data = req.body
            let  user = await adminServices.addUser(req.user.id, data);
            if(user && user.err){
                return (
                    res.status(400).json({success: false, error: user.message})
                )
            }
            res.status(200).json({ 
                success: true, 
                "First Name": user.firstName,
                "Last Name": user.lastName,
                "Phone": user.phone,
                message: "User added successfully!" });
            } else {
                throw {
                    message: "RESTRICTED"
                }
        }} else {
            throw {
                message: "NOT LOGGED IN"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(200).json({ ex: ex, success: false });
    }
});

router.post("/update", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            if (req.user.isAdmin) {
                let data = req.body;
                let user = await adminServices.updateUser(data);
                if(user && user.err){
                    return (
                        res.status(400).json({success: false, error: user.message})
                    )
                }
                res.status(200).json({ message: "User updated successfully!", updatedUser: user ? user : null});
            } else {
                throw {
                    message: "RESTRICTED"
                }
        }} else {
            throw {
                message: "NOT LOGGED IN"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    } 
});

router.post("/delete", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            if (req.user.isAdmin) {
                let data = req.body;
                let user = await adminServices.deleteUser(data);
                if(user && user.err){
                    return (
                        res.status(400).json({success: false, error: user.message})
                    )
                }
                res.status(200).json({ success : user.success, message: "User deleted!" });
            } else {
                throw {
                    message: "RESTRICTED"
                }
        }} else {
            throw {
                message: "NOT LOGGED IN"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
});

module.exports = router;
