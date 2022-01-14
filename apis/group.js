const router = require("express").Router();
const groupServices = require("../services/groupServices");
const passport = require('passport');

router.get("/", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user ){
            if (req.user.isAdmin) {
                let groups = await groupServices.getAllGroups(req.user.id);
                res.status(200).json({ 
                    "All Groups": groups
                })
            } else {
                throw {
                    message: "RESTRICTED"
                }
            }
        } else {
            throw {
                message: "Not Logged in"
            }
        }
        
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
});

router.post("/createGroup", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user){
            if (req.user.isAdmin) {
                let data = req.body
                let group = await groupServices.createGroup(req.user.id, data);
                if(group && group.err){
                    return (
                        res.status(400).json({success: false, error: group.message})
                    )
                }
                res.status(200).json({ 
                    success: true, 
                    "Group Name": group.name,
                    "Group Members": group.members,
                    message: "Group created successfully!" });
            } else {
                throw {
                    message: "RESTRICTED"
                }
            }
        } else {
            throw {
                message: "Not logged in"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(200).json({ ex: ex, success: false });
    }
});

router.post("/addMember", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            if (req.user.isAdmin) {
                let data = req.body;
                let group = await groupServices.addMember(req.user.id, data);
                if(group && group.err){
                    return (
                        res.status(400).json({success: false, error: group.message})
                    )
                }
                res.status(200).json({ message: "Member added successfully!", group: group ? group : null});

            } else {
                throw {
                    message : "RESTRICTED"
                }
            }
        } else {
            throw {
                message: "Not logged in"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    } 
});

router.post("/removeMember", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            if (req.user.isAdmin) {
                let data = req.body;
                let group = await groupServices.removeMember(req.user.id, data);
                if(group && group.err){
                    return (
                        res.status(400).json({success: false, error: group.message})
                    )
                }
                res.status(200).json({ message: "Member removed successfully!", group: group ? group : null});

            } else {
                throw {
                    message : "RESTRICTED"
                }
            }
        } else {
            throw {
                message: "Not logged in"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    } 
});

router.post("/deleteGroup", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            if (req.user.isAdmin) {
                let data = req.body;
                let group = await groupServices.deleteGroup(req.user.id, data);
                if(group && group.err){
                    return (
                        res.status(400).json({success: false, error: group.message})
                    )
                }
                res.status(200).json({ success : group.success, message: "Group deleted!" });

            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
});

router.post("/sendMessage", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            let data = req.body
            let sms = await groupServices.sendSMS(req.user.id, data)
            if(sms && sms.err){
                return (
                    res.status(400).json({success: false, error: sms.errMsg})
                )
            }
            res.status(200).json({ 
                success: true, 
                "SMS": sms.message,
                "To Group": sms.group,
                "Sent By": sms.sentBy,
                "NOTE": sms.errMsg });
        } else {
            throw {
                message: "Not logged in"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
})

router.get("/getAllMsgFromGrp", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            let data = req.body
            let sms = await groupServices.getAllMsg(req.user.id, data)
            if(sms && sms.err){
                return (
                    res.status(400).json({success: false, error: sms.errMsg})
                )
            }
            res.status(200).json({ 
                success: true, 
                "Messages": sms})
        } else {
            throw {
                message: "Not logged in"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
})

router.get("/getAllGrpMembers", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            let data = req.body
            let sms = await groupServices.getAllMembers(req.user.id, data)
            if(sms && sms.err){
                return (
                    res.status(400).json({success: false, error: sms.errMsg})
                )
            }
            res.status(200).json({ 
                success: true, 
                "Messages": sms})
        } else {
            throw {
                message: "Not logged in"
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
})

module.exports = router;
