const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
var morgan = require('morgan');
require('dotenv').config()
const {
    ExtractJwt,
    Strategy
} = require('passport-jwt');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require("./config");
const User = require("./models/user");

const apis = require("./apis");

// MongoDB connection
mongoose.connect(config.db, {
    useNewUrlParser: true,
}).then(success => {
    console.log("MongoDB connected!!!", config.db);
}).catch(err => {
    console.log("MongoDB connection failed!!!", err)
});

app.use(morgan('tiny'))
app.use(cors({
    exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json({
    limit: "1000kb"
}));

app.use(passport.initialize({
    session: false
}))

const jwtOptions = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    passReqToCallback: true
}

passport.serializeUser(function (user, done) {
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser(async function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
})

passport.use('jwt', new Strategy(jwtOptions, async (req, jwt_payload, done) => {
    console.log(jwt_payload);
    try {
        User.findOne({ phone: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    } catch (ex) {
        return done(null, false);
    }
}));

apis(app);

app.listen(process.env.PORT || 9090);