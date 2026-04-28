// category.validation.js

import Joi from "joi";

export const createCategoryValidation = Joi.object({

  name: Joi.string()
    .trim()
    .required(),

  slug: Joi.string()
    .trim()
    .lowercase()
    .required(),

  parentCategory: Joi.string()
    .optional()
    .allow(null, ""),

  image: Joi.string()
    .optional()
    .allow(""),

  isActive: Joi.boolean()
    .optional(),

});