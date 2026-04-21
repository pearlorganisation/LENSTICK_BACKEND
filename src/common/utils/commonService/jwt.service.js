import jwt from "jsonwebtoken";

class JwtService {
  // 🔑 Generate Access + Refresh tokens
  static generateTokens(user) {
    const payload = {
      id: user._id,
      role: user.role,
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
    };
    
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token, secret) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
}

export default JwtService;
