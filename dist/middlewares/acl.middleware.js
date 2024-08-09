"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (roles) => (req, res, next) => {
    const userRoles = req.user.roles;
    if (!userRoles || !userRoles.some((userRole) => roles.includes(userRole))) {
        return res.status(403).json({
            message: "Forbidden",
        });
    }
    next();
};
