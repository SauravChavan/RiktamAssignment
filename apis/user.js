const router = require("express").Router();
const userServices = require("../services/userServices");
const passport = require('passport');

router.post("/login", async (req, res) => {
    const result = await userServices.login(req.body);
    console.log('result', result)
    if (result && result.err) {
        return res.status(400).json({message: result.message});
    }
    return res.status(200).json({
        message: "OK",
        token: result.token,
        user: result.user,
    });
});

router.post("/updatePassword", passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.user) {
            let data = req.body
            let result = await userServices.updatePassword(req.user, data)
            if (req.session && result) {
                delete req.headers.authorization;
                res.json({message: "Please login again"})
            }
        } else {
            throw {
                message: "Not logged in."
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(400).json(ex);
    }
})

router.get("/logout", async(req, res) => {
    delete req.headers.authorization;
    req.logout();
    res.status(200).json({message: "Logged out successfully."})
})

module.exports = router;
