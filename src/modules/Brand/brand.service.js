// modules/brand/brand.service.js
import Brand from "./brand.model.js";

export const createBrand = async (data) => {
  return await Brand.create(data);
};

export const getBrands = async () => {
  return await Brand.find({ isActive: true });
};