// validations/product.validation.js

import Joi from "joi";

export const createProductValidation = Joi.object({
  name: Joi.string().required(),

  slug: Joi.string().required(),

  description: Joi.string().allow(""),

  shortDescription: Joi.string().allow(""),

  category: Joi.string().required(),

  subCategory: Joi.string().allow(null, ""),

  gender: Joi.array().items(Joi.string()),

  productType: Joi.string().allow(""),

  frameShape: Joi.string().allow(""),

  frameType: Joi.string().allow(""),

  frameMaterial: Joi.string().allow(""),

  collection: Joi.string().allow(""),

  brand: Joi.string().allow(""),

  tags: Joi.array().items(Joi.string()),

  features: Joi.array().items(Joi.string()),

  variants: Joi.array()
    .items(
      Joi.object({
        sku: Joi.string().required(),

        color: Joi.string().required(),

        frameColor: Joi.string().required(),

        size: Joi.string().required(),

        ageGroup: Joi.string().allow(""),

        price: Joi.number().required(),

        salePrice: Joi.number().allow(null),

        discountPercentage: Joi.number(),

        stock: Joi.number().required(),

        sold: Joi.number(),

        images: Joi.array().items(
          Joi.object({
            url: Joi.string().required(),

            public_id: Joi.string().required(),
          })
        ),
      })
    )
    .required(),
});