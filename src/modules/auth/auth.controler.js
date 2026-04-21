import asyncHandler from "../../common/utils/asyncHandler.js";
import CustomError from "../../common/utils/customError.js";
import successResponse from "../../common/utils/sucessResponse.js";
import UserService from "../user/user.service.js";
import JwtService from "../../common/utils/commonService/jwt.service.js";
import { generateOTP } from "../../common/utils/commonService/otpUtil.js";
import TokenService from "../../common/utils/commonService/token.service.js";
import OTP from "./otp.model.js";
import { sendOtpEmail } from "../../common/utils/commonService/mail.service.js";
import { sendOtpSMS } from "../../common/utils/commonService/sms.service.js";
import ms from "ms";
import MongooseService from "../../common/utils/commonService/mogoose.service.js";

class AuthController {
  static register = asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      role = "CUSTOMER",
    } = req.body;

    if (!firstName || !lastName) {
      throw new CustomError("First name and last name are required", 400);
    }

    if (!email && !phoneNumber) {
      throw new CustomError(
        "Either email or phone number must be provided",
        400
      );
    }

    const otp = generateOTP();

    const emailUser = email && (await UserService.findByEmail(email));

    const phoneUser =
      phoneNumber && (await UserService.findByPhoneNumber(phoneNumber));

    const existing = emailUser?.data?.user || phoneUser?.data?.user;

    if (existing) {
      if (existing.isVerified) {
        throw new CustomError("User already exists!", 400);
      }

      // resend OTP
      await OTP.findOneAndUpdate(
        { email, phoneNumber, type: "REGISTER" },
        {
          otp,
          createdAt: new Date(), // reset expiry timer
        },
        { upsert: true, new: true }
      );

      if (email) await sendOtpEmail(`${firstName}`, email, otp);
      if (phoneNumber) await sendOtpSMS(phoneNumber, otp);

      return successResponse(
        res,
        {},
        "Account pending verification. OTP resent successfully.",
        200
      );
    }

    const result = await UserService.register({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
    });

    if (!result.success) {
      throw new CustomError(result.message, 400);
    }

    await OTP.create({
      email,
      phoneNumber,
      otp,
      type: "REGISTER",
    });

    if (email) await sendOtpEmail(firstName, email, otp, "REGISTER");
    if (phoneNumber) await sendOtpSMS(phoneNumber, otp);

    return successResponse(res, null, result.message, 201);
  });

  static verifyOtp = asyncHandler(async (req, res) => {
    const { email, phoneNumber, otp, type = "REGISTER" } = req.body;

    if ((!email && !phoneNumber) || !otp || !type) {
      throw new CustomError("Email or Phone, OTP and type are required", 400);
    }

    const query = email ? { email, type } : { phoneNumber, type };

    const otpRecord = await OTP.findOne(query);

    if (!otpRecord) {
      throw new CustomError("OTP expired or not found", 400);
    }

    if (otpRecord.otp !== otp) {
      throw new CustomError("Invalid OTP", 400);
    }

    const userResult = email
      ? await UserService.findByEmail(email)
      : await UserService.findByPhoneNumber(phoneNumber);

    const user = userResult?.data?.user;

    if (!user) {
      throw new CustomError("User not found", 400);
    }

    if (otpRecord.type === "FORGOT_PASSWORD") {
      await OTP.deleteOne(query);

      return successResponse(
        res,
        null,
        "OTP verified successfully. You can now reset your password.",
        200
      );
    }

    if (user.isVerified) {
      // If somehow verified but OTP existed, just clean up
      await OTP.deleteOne({ email, phoneNumber, type });
      throw new CustomError("User already verified", 400);
    }

    user.isVerified = true;

    const tokens = JwtService.generateTokens(user);
    user.refresh_token = tokens.refreshToken;

    await user.save();

    await OTP.deleteOne({ email, phoneNumber, type });

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_ACCESS_EXPIRATION),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_REFRESH_EXPIRATION),
    });

    return successResponse(
      res,
      { user, tokens },
      "OTP verified successfully!",
      200
    );
  });

  static login = asyncHandler(async (req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      throw new CustomError("Email or phone number is required", 400);
    }

    // find user
    const userResult = email
      ? await UserService.findByEmail(email)
      : await UserService.findByPhoneNumber(phoneNumber);

    const user = userResult?.data?.user;

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const otp = generateOTP();

    // save OTP
    await OTP.findOneAndUpdate(
      email ? { email, type: "LOGIN" } : { phoneNumber, type: "LOGIN" },
      {
        otp,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // send OTP
    if (email) await sendOtpEmail(user.firstName, email, otp, "LOGIN");
    if (phoneNumber) await sendOtpSMS(phoneNumber, otp);

    return successResponse(res, null, "OTP sent successfully", 200);
  });

  static logout = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    // await redis.del(`refresh:${userId}`);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    successResponse(res, null, "Logged out successfully", 200);
  });

  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    const userId = req.user.id;

    // const redisToken = await redis.get(`refresh:${userId}`);

    // if (!redisToken || redisToken !== refreshToken) {
    //   throw new CustomError("Invalid refresh token", 401);
    // }

    const userResult = await UserService.findById(userId);

    if (!userResult.success) {
      throw new CustomError("Invalid Details", 401);
    }

    userResult.data.user = MongooseService.cleanObject(userResult.data.user);

    const tokens = JwtService.generateTokens(userResult.data.user);

    // await redis.set(
    //   `refresh:${userId}`,
    //   tokens.refreshToken,
    //   "EX",
    //   ms(process.env.JWT_REFRESH_EXPIRATION) / 1000
    // );

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_ACCESS_EXPIRATION),
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_REFRESH_EXPIRATION),
    });

    successResponse(res, userResult.data, "Token refreshed successfully", 200);
  });
}

export default AuthController;
