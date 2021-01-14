const Ravepay = require('flutterwave-node');

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