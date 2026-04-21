import crypto from "crypto";
// import redis from "../../config/redis.js";
import CustomError from "../customError.js";

class TokenService {
  static async generateRegisterToken(userId) {
    if (!userId) {
      throw new CustomError("Something went wrong", 500);
    }
    const token = crypto.randomBytes(32).toString("hex");

    // await redis.set(`registerToken:${userId}`, token,{
    //   EX:30 * 60
    // });

    return token;
  }

  static async verifyRegisterToken(userId, token) {
    if (!token || !userId) {
      throw new CustomError("Missing userId or token", 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check token belongs to same user
    if (decoded.userId !== userId) {
      return false;
    }

    // const storedToken = await redis.get(`registerToken:${userId}`);

    // if (!storedToken) {
    //   return false
    // }

    // if (storedToken !== token) {
    //   return false
    // }

    // await redis.del(`registerToken:${userId}`);

    return true;
  }
}

export default TokenService;
