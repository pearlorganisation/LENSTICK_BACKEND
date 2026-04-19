import CustomError from "../../utils/customError.js";
import JwtService from "../../utils/commonService/jwt.service.js";

const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken; // read from cookies

    if (!token) {
      throw new CustomError("Access token missing", 401);
    }

    // Verify token using JwtService
    const decoded = JwtService.verifyToken(token, process.env.JWT_ACCESS_SECRET);

    if (!decoded) {
      throw new CustomError("Invalid or expired access token", 401);
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

export default verifyAccessToken;
