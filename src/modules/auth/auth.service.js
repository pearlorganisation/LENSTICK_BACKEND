import verifyGoogleToken from "./google.service.js";
import UserService from "../user/user.service.js";
import JwtService from "../../common/utils/commonService/jwt.service.js";
import CustomError from "../../common/utils/customError.js";

export const googleAuthService = async (token) => {
  const payload = await verifyGoogleToken(token);

  const { email, sub, email_verified } = payload;

  console.log("payload ", payload);

  console.log("email sub , verified ", email, sub, email_verified);

  if (!email_verified) {
    throw new CustomError("Email not verified by Google", 400);
  }

  let user = await UserService.findByEmail(email);

  console.log("user after fine by  ", user);

  //  REGISTER FLOW
  if (!user?.data) {
    const firstName = payload.given_name || name?.split(" ")[0] || "User";

    const lastName =
      payload.family_name || name?.split(" ").slice(1).join(" ") || "";

    console.log("regist service call ");

    const registerResult = await UserService.register({
      firstName,
      lastName,
      email,
      phoneNumber: null,
      role: "CUSTOMER",
    });

    console.log("register  result  ", registerResult);

    if (!registerResult.success) {
      throw new CustomError(registerResult.message, 400);
    }

    user = registerResult.data.user;

    // Add Google-specific fields
    user.googleId = sub;
    user.isVerified = true;

    await user.save();
  }

  // ✅ LOGIN FLOW (for both new + existing user)
  const tokens = JwtService.generateTokens(user);

  console.log("tokens ", tokens);

  return {
    data: {
      user,
      tokens,
    },
  };
};
