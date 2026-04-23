import User from "./user.model.js";

const isDev = () => process.env.NODE_ENV === "development";

class UserService {
  static async findById(Id) {
    try {
      const user = await User.findById(Id);

      if (!user) {
        return { success: false, message: "User not found", data: null };
      }

      return { success: true, message: "User found", data: { user } };
    } catch (error) {
      return {
        success: false,
        message: isDev() ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  // 🔎 Find user by email
  static async findByEmail(email) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return { success: false, message: "User not found", data: null };
      }

      return { success: true, message: "User found", data: { user } };
    } catch (error) {
      return {
        success: false,
        message: isDev() ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  //  Find user by phoneNumber
  static async findByPhoneNumber(phoneNumber) {
    try {
      const user = await User.findOne({ phoneNumber });

      if (!user) {
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "User found",
        data: user, // cleaner (no extra { user })
      };
    } catch (error) {
      return {
        success: false,
        message: isDev() ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }

  // 📝 Register new user
  static async register(data) {
    try {
      const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        isVerified: false,
      });

      return {
        success: true,
        message: "Account created. Please verify OTP.",
        data: { user },
      };
    } catch (error) {
      return {
        success: false,
        message: isDev() ? error.message : "Internal Server Error",
        data: null,
      };
    }
  }
}

export default UserService;
