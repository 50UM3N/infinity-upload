const introized = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/intro");
};

const authorize = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/login");
};

const notAuthorize = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/");
};

const permit = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) return next();
        return res.redirect("/");
    };
};

module.exports = {
    authorize,
    notAuthorize,
    introized,
    permit,
};
