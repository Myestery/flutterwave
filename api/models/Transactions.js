const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transactions = new Schema(
  {
    name: { type: String, required: true },
    ref: { type: String, required: true },
    used: { type: Boolean, required: true },
    remark: { type: String },
    User: { type: Schema.Types.ObjectId, ref: "User"},
    amount: { type: Number, required: true },
    meta: { type: Map}
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Transactions", Transactions);
