import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
{
   name: {
      type: String,
      required: true,
   },

   slug: {
      type: String,
      required: true,
      unique: true,
   },

   parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
   },

    image: {
      url: {
        type: String,
      },

      key: {
        type: String,
      },
    },

   level: {
      type: Number,
      default: 0,
   },

   isActive: {
      type: Boolean,
      default: true,
   },

},
{
   timestamps: true,
}
);

const Category = mongoose.model("Category", categorySchema);

export default Category;