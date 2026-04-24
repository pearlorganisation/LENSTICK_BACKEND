import JwtService from "../../utils/commonService/jwt.service.js";

const isAuthenticated = (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = JwtService.verifyToken(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
