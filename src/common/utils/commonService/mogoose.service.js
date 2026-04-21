import mongoose from "mongoose";

class MongooseService {
  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static cleanObject = (doc) => {
    if (!doc) return null;

    const obj = doc.toObject ? doc.toObject() : { ...doc };

    const removeFields = [
      "isDeleted",
      "createdAt",
      "updatedAt",
      "__v",
      "password",
    ];

    function deepClean(value, seen = new WeakSet()) {
      if (value === null || value === undefined) return value;
      if (typeof value !== "object") return value;

      if (seen.has(value)) return value;
      seen.add(value);

      if (Array.isArray(value)) {
        return value.map((item) => deepClean(item, seen));
      }

      removeFields.forEach((field) => {
        if (field in value) {
          delete value[field];
        }
      });

      Object.keys(value).forEach((key) => {
        value[key] = deepClean(value[key], seen);
      });

      return value;
    }

    return deepClean(obj);
  };
}

export default MongooseService;
