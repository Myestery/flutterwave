const mongoose = require("mongoose");
const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  name: {
    type: Map,
    of: String,
    required: true
  },
  phone_number:{type:String},
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  image: { type: String },
  roles: {
    type: [
      new Schema({
        role: {
          type: String,
          validate: {
            validator: v => ["buyer", "rider", "shop_owner"].includes(v),
            message: props => `${props.value} is not a valid role!`
          },
          required: [true, 'User roles required']
        }
      })
    ]
  },
  country: {
    type:String,
  },
  account: {
    type: Map,
    of: String,
  },
  shop:{ type: Schema.Types.ObjectId, ref: "Shop" },
});
export default mongoose.model("User", UserSchema);

