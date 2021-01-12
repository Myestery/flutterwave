<template>
  <div style="margin-top: 10%">
    <div class="panel panel-default bootstrap-basic">
      <form
        class="panel-body"
        action="your-form-handling-page"
        method="POST"
        id="checkout-form"
        onsubmit="return do_when_clicking_submit_button()"
      >
        <div class="row">
          <div class="form-group col-md-12">
            <label for="cardholder-name">Name on Card</label>
            <input
              type="text"
              class="form-control"
              id="cardholder-name"
              placeholder="Full Name"
            />
            <span class="helper-text"></span>
          </div>
          <!--Hosted Field for CC number-->
          <div class="form-group col-md-12">
            <label for="card-number">Card Number</label>
            <div class="input-group">
              <div
                class="form-control"
                id="card-number"
                data-bluesnap="ccn"
              ></div>
              <div id="card-logo" class="input-group-addon">
                <img
                  src="https://files.readme.io/d1a25b4-generic-card.png"
                  height="20px"
                />
              </div>
            </div>
            <span class="helper-text" id="card-help"></span>
          </div>
          <!--Hosted Field for CC EXP-->
          <div class="form-group col-xs-7">
            <label for="exp-date">Exp. Date</label>
            <div class="form-control" id="exp-date" data-bluesnap="exp"></div>
            <span class="helper-text"></span>
          </div>
          <!--Hosted Field for CC CVV-->
          <div class="form-group col-xs-5">
            <label for="cvv">Security Code</label>
            <div class="form-control" id="cvv" data-bluesnap="cvv"></div>
            <span class="helper-text"></span>
          </div>
        </div>

        <button
          class="btn btn-success btn-lg col-xs-6 col-xs-offset-3"
          type="submit"
          id="submit-button"
        >
          Pay Now
        </button>
      </form>
    </div>
  </div>
</template>
<script>
var bsObj = {
  hostedPaymentFields: {
    ccn: "ccn", // name cannot contain spaces or special characters
    cvv: "cvv", // name cannot contain spaces or special characters
    exp: "exp", // name cannot contain spaces or special characters
  },
  onFieldEventHandler: {
    onFocus: function (tagId) {
      // Handle focus
      if (tagId == "ccn") {
        $("#card-number").addClass("hosted-field-focus");
      } else if (tagId == "exp") {
        $("#exp-date").addClass("hosted-field-focus");
      } else if (tagId == "cvv") {
        $("#cvv").addClass("hosted-field-focus");
      }
    },
    onBlur: function (tagId) {
      // Handle blur
      if (tagId == "ccn") {
        $("#card-number").removeClass("hosted-field-focus");
      } else if (tagId == "exp") {
        $("#exp-date").removeClass("hosted-field-focus");
      } else if (tagId == "cvv") {
        $("#cvv").removeClass("hosted-field-focus");
      }
    },
    onError: function (tagId, errorCode) {
      // Handle a change in validation
      /* error codes:
							"001" --> "Please enter a valid credit card number";			
							"002" --> "Please enter the CVV/CVC of your card";			
							"003" --> "Please enter your credit card's expiration date";			
							"004" --> "Session expired please refresh page to continue";			
							"005" --> "Internal server error please try again later";			
						*/

      if (tagId == "ccn" && errorCode == "001") {
        $("#card-number")
          .removeClass("hosted-field-focus hosted-field-valid")
          .addClass("hosted-field-invalid");
        $("#card-help").text("Please enter a valid credit card number");
      } else if (tagId == "exp" && errorCode == "003") {
        $("#exp-date")
          .removeClass("hosted-field-focus hosted-field-valid")
          .addClass("hosted-field-invalid")
          .next("span")
          .text("Please enter the expiration date (MM/YYYY)");
      } else if (tagId == "cvv" && errorCode == "002") {
        $("#cvv")
          .removeClass("hosted-field-focus hosted-field-valid")
          .addClass("hosted-field-invalid")
          .next("span")
          .text("Please enter the CVV/CVC of your card");
      }
    },
    onEmpty: function (tagId, errorCode) {
      // Handle a change in validation
      if (tagId == "ccn" && errorCode == "001") {
        $("#card-number").removeClass(
          "hosted-field-focus hosted-field-valid hosted-field-invalid"
        );
        $("#card-help").text("");
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/d1a25b4-generic-card.png"
        );
      } else if (tagId == "exp" && errorCode == "003") {
        $("#exp-date")
          .removeClass(
            "hosted-field-focus hosted-field-valid hosted-field-invalid"
          )
          .next("span")
          .text("");
      } else if (tagId == "cvv" && errorCode == "002") {
        $("#cvv")
          .removeClass(
            "hosted-field-focus hosted-field-valid hosted-field-invalid"
          )
          .next("span")
          .text("");
      }
    },
    onType: function (tagId, cardType) {
      // get card type from cardType and display the img accordingly

      if (cardType == "AmericanExpress") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/97e7acc-Amex.png"
        );
      } else if (cardType == "CarteBleue") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/5da1081-cb.png"
        );
      } else if (cardType == "DinersClub") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/8c73810-Diners_Club.png"
        );
      } else if (cardType == "Discover") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/caea86d-Discover.png"
        );
      } else if (cardType == "JCB") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/e076aed-JCB.png"
        );
      } else if (cardType == "MaestroUK") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/daeabbd-Maestro.png"
        );
      } else if (cardType == "MasterCard") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/5b7b3de-Mastercard.png"
        );
      } else if (cardType == "Solo") {
        $("#card-logo img").attr(
          "src",
          "https://sandbox.bluesnap.com/services/hosted-payment-fields/cc-types/solo.png"
        );
      } else if (cardType == "Visa") {
        $("#card-logo img").attr(
          "src",
          "https://files.readme.io/9018c4f-Visa.png"
        );
      }
    },
    onValid: function (tagId) {
      // Handle a change in validation
      if (tagId == "ccn") {
        $("#card-number")
          .removeClass("hosted-field-focus hosted-field-invalid")
          .addClass("hosted-field-valid");
        $("#card-help").text("");
      } else if (tagId == "exp") {
        $("#exp-date")
          .removeClass("hosted-field-focus hosted-field-invalid")
          .addClass("hosted-field-valid")
          .next("span")
          .text("");
      } else if (tagId == "cvv") {
        $("#cvv")
          .removeClass("hosted-field-focus hosted-field-invalid")
          .addClass("hosted-field-valid")
          .next("span")
          .text("");
      }
    },
  },
  //styling is optional
  style: {
    // Styling all Hosted Payment Field inputs
    input: {
      "font-size": "14px",
      "font-family": "Helvetica Neue,Helvetica,Arial,sans-serif",
      "line-height": "1.42857143",
      color: "#555",
    },

    // Styling a specific field
    /*"#ccn": {
						
					},*/

    // Styling Hosted Payment Field input state
    ":focus": {
      color: "#555",
    },
  },
  ccnPlaceHolder: "4111222233334444",
  cvvPlaceHolder: "123",
  expPlaceHolder: "MM/YYYY",
};

// Submits the credit card, expiration date and CVV data to BlueSnap, where it will be associated with the Hosted Payment Fields token. On success, a card data object containing the card type and last four digits will be be passed to the function (cardData). You should add a function to do the final submit of the form after the card type and last four digits are received.

function do_when_clicking_submit_button() {
  // bluesnap.submitCredentials(function (cardData) {
  //   console.log(
  //     "the card type is " +
  //       cardData.ccType +
  //       " and last 4 digits are " +
  //       cardData.last4Digits +
  //       " and exp is " +
  //       cardData.exp +
  //       " after that I can call final submit"
  //   );
  // });
  /* submit the form
				return true; */
  return false; // don't submit the form
}

export default {
  data: () => ({
    card: {},
  }),
};
</script>
<style lang="css">
/* Bootstrap styles*/

.panel {
  width: 70%;
  margin: 2em auto;
}

.panel-body {
  width: 90%;
  margin: 2em auto;
}

.helper-text {
  color: #e93143;
  font-size: 12px;
  margin-top: 5px;
  height: 12px;
  display: block;
}

/* Hosted Payment Fields styles*/
.hosted-field-focus {
  border: 1px solid #66afe9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}

.hosted-field-invalid {
  border: 1px solid #e93143;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(233, 49, 67, 0.8);
}

.hosted-field-valid {
  border: 1px solid #14ba57;
}
</style>