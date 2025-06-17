exports.isAuth = (req, res, next) => {
    if (req.user && req.isAuthenticated()) {
        return true;
    }
    return false;
}

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.ruolo == 1) {
        return true;
    }
    return false;
}