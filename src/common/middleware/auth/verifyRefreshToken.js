// middlewares/verifyAccessToken.js
import CustomError from "../../utils/customError";
import JwtService from "../../utils/commonService/jwt.service";

const verifyRefreshToken = (req, res, next) => {
  try {
    console.log("Verifying refresh token...");
    const token = req.cookies?.refreshToken; // read from cookies

    if (!token) {
      throw new CustomError("Refresh token missing", 401);
    }

    // Verify token using JwtService
    const decoded = JwtService.verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    if (!decoded) {
      throw new CustomError("Invalid or expired refresh token", 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

export default verifyRefreshToken;
