module.exports = {
    port: process.env.PORT || 9090,
    // db: process.env.DB || 'mongodb://ufwt3fchyv6l1rvtadao:GBL38nVMdPPI2DGqLZJ8@borxekcscvwwiur-mongodb.services.clever-cloud.com:27017/borxekcscvwwiur',
    db: "mongodb://localhost:27017/riktam",
    jwtSecret: process.env.JWT_SECRET || "123456789qwertyRiktam",
    secret: process.env.SECRET || "Riktam@Riktam",
    corsHeaders: ["Link"],
};