const localStrategy = require("passport-local").Strategy;
const googleStrategy = require("passport-google-oauth2").Strategy;
const ROLE = require("../models/role");

const passportAuthenticator = (passport, user) => {
    passport.use(
        new localStrategy(
            { usernameField: "email" },
            (email, password, done) => {
                user.findOne({ email: email }, (err, data) => {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        return done(null, false, {
                            message: "No user with that email",
                        });
                    } else {
                        if (data.password == password) {
                            return done(null, data);
                        } else {
                            return done(null, false, {
                                message: "Password incorrect",
                            });
                        }
                    }
                });
            }
        )
    );
    passport.serializeUser((data, done) => {
        done(null, data.id);
    });
    passport.deserializeUser((id, done) => {
        user.findById(id, (err, data) => {
            done(null, data);
        });
    });
};

function googleAuthenticator(passport, user) {
    passport.use(
        new googleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`,
            },
            (accessToken, refreshToken, profile, done) => {
                user.findOne({ email: profile._json.email }, (err, data) => {
                    if (data) {
                        if (data.authType == "google") {
                            return done(null, data);
                        } else {
                            return done(null, false, {
                                message: `User already exist use ${data.authType} login`,
                            });
                        }
                    } else {
                        user({
                            email: profile._json.email,
                            name: profile._json.name,
                            authType: "google",
                            authId: profile._json.sub,
                            thumbnail: profile._json.picture,
                            role: ROLE.USER,
                        }).save((err, data) => {
                            if (err) {
                                console.log("Error in database");
                                return done(err);
                            }
                            if (data) {
                                return done(null, data);
                            }
                        });
                    }
                });
            }
        )
    );
}

module.exports = { passportAuthenticator, googleAuthenticator };
