const Ravepay = require('flutterwave-node');
import Good from '../models/Good'
import Shop from '../models/Shop'
const jwt = require("jsonwebtoken");
const config = require("../config");
const rave = new Ravepay(process.env.PUBLIC_KEY, process.env.PRIVATE_KEY, false);

export const exchange_rates = async (req,res) => {
    let FromCurrency = req.query.FromCurrency;
    let ToCurrency = req.query.ToCurrency;
    let Amount = req.query.Amount
    let response
	const payload = {
            service: "rates_convert",
            service_method: "post",
            service_version: "v1",
            service_channel: "transactions",
            service_channel_group: "merchants",
            service_payload: {
              FromCurrency,
              ToCurrency,
              Amount
            }
          };
	try {
		 response = await rave.Misc.exchange_rates(payload);
	} catch (error) {
		console.log(error);
    }
    return res.json({success:true,data:response})
};

export const goods = async (req, res) => {
  //get user
  var token = req.headers.authorization;
  let user;
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token.replace(/^Bearer\s/, ""), config.authSecret, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({ message: "unauthorized" });
      } else {
        user = decoded;
      }
    });
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }


  //get shop, verify that the user has a shop before continuing
  let shop = await Shop.findOne({ owner: user._id }).populate({
    path: 'goods',
    populate: { path: 'Good' }
  }).exec()
  if (!shop) {
    return res.status(404).json({"error":"User has no shop"})
  }

  return res.json(shop.goods.map(good=>good.Good).filter(x=>x!=null))
  //get goods from shop
}

export const resolve = async (req,res)=>{
  const callVerify =  async (ref) => {

    const payload = {
        txref:ref
    }
    try {
       const response =  await rave.VerifyTransaction.verify(payload)
      console.log(response);
      return res.json({response})
    } catch (error) {
        console.log(error)
    }                            
   
}

callVerify("JUMGA-1610611807168");
}