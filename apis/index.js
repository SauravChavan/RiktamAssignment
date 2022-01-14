const admin = require("./admin");
const user = require("./user");
const group = require("./group")

module.exports = (app) => {
    app.use("/api/admin", admin);
    app.use("/api/user", user);
    app.use("/api/group", group)
}