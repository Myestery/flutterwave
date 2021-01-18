const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Shop = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String},
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    goods: [
      new Schema({
        Good: { type: Schema.Types.ObjectId, ref: "Good", required: true }
      })
    ],
    rider: { type: Schema.Types.ObjectId, ref: "User"},
    active: { type: Boolean, required: true },
    subaccount_id:{type:String, required:true}
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Shop", Shop);
