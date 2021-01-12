const mongoose = require("mongoose");
const Schema = mongoose.Schema;

export const PurchaseSchema = new Schema({
  name: String, //The name of the good
  price: { type: Number, required: true }, //The price of the good
  Good: { type: Schema.Types.ObjectId, ref: "Good", required: true },
  User: { type: Schema.Types.ObjectId, ref: "User", required: true },
  transaction_id: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
    required: true
  }
});
export default mongoose.model("Purchase", PurchaseSchema);
