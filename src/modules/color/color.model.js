const colorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hexCode: String,
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("Color", colorSchema);