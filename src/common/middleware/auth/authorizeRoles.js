import CustomError from "../../utils/customError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return next(new CustomError("Access denied. User not authenticated", 403));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new CustomError("Forbidden: You do not have permission", 403)
      );
    }

    next();
  };
};