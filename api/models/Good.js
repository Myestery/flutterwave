const mongoose = require("mongoose");
const Schema = mongoose.Schema;

export const GoodSchema = new Schema({
  name: String, //The name of the good
  price: { type: Number, required: true }, //The price of the god
  description: { type: String, required: false }, // Descripton:Other info about the good
  Shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  category: {
    type: String,
    validate: {
      validator: v => ["men", "women", "children","unisex"].includes(v),
      message: props => `${props.value} is not a valid category!`
    },
    required: [true, "Goods category required"]
  }
});
export default mongoose.model("Good", GoodSchema);
