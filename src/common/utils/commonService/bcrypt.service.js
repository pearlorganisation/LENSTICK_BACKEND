import bcrypt from "bcrypt";

class BcryptService {
  static saltRounds = 10;

  // 🔑 Hash a plain text value
  static async hashValue(originalValue) {
    return await bcrypt.hash(originalValue, this.saltRounds);
  }

  // 🔍 Compare plain text with hashed value
  static async compareValue(originalValue, hashedValue) {
    return await bcrypt.compare(originalValue, hashedValue);
  }
}

export default BcryptService;
