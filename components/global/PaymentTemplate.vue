<template>
  <div>
    <v-card color="basil" v-if="status == null || card_has_error">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold display-2 basil--text">Payment Options</h1>
      </v-card-title>

      <v-tabs v-model="tab" grow>
        <v-tab
          v-for="card in [
            'card',
            'mpesa',
            'Ghana Mobile Money',
            'Bank (Nigerian Users Only)',
          ]"
          :key="card"
        >
          {{ card }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="card in [
            'card',
            'mpesa',
            'Ghana Mobile Money',
            'Bank (Nigerian Users Only)',
          ]"
          :key="card"
        >
          <v-card color="basil" flat>
            <v-form v-model="s_valid">
              <v-card>
                <v-card-title>
                  Pay {{ currency }}{{ amount_to_pay }} with {{ card }}
                </v-card-title>
                <v-alert
                  v-if="card_has_error"
                  dismissible
                  icon="mdi-cancel"
                  type="error"
                >
                  {{ card_error }}
                </v-alert>
                <v-row justify="center" xs6 md3>
                  <v-col class="col-12 col-md-4 col-sm-12">
                    <v-text-field
                      solo
                      label="Card number"
                      :rules="cardRules"
                      v-model="card_value"
                      type="number"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      name="cvv"
                      label="CVV"
                      length="3"
                      max="999"
                      solo
                      v-model="cvv"
                      type="number"
                      :rules="cvvRules"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center" xs6 md3>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      name="account_number"
                      solo
                      :items="months"
                      item-text="month"
                      item-value="val"
                      label="Expiration Month"
                      v-model="card_month"
                      type="number"
                      :rules="nameRules"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      name="account_number"
                      solo
                      :items="years"
                      item-text="year"
                      item-value="val"
                      label="Expiration Year"
                      v-model="card_year"
                      type="number"
                      :rules="nameRules"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn
                    color="info"
                    justify-center
                    block
                    :disabled="!s_valid"
                    @click="PassData(types[tab])"
                    >Pay Now</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-container style="height: 400px" v-if="status == 'paying'">
      <v-row class="fill-height" align-content="center" justify="center">
        <v-col class="subtitle-1 text-center" cols="12">
          Contacting Flutterwave
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
    <v-row justify="center" v-if="status == 'needs_pin'">
      <v-dialog v-model="dialog1" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">ATM PIN Required</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                label="You need to enter your atm pin to continue"
                hint="ATM pin"
                persistent-hint
                v-model="extra.pin"
                type="password"
                required
              ></v-text-field>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="
                dialog = false;
                PassData(types[tab], { suggested_auth: 'PIN' });
              "
            >
              COntinue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center" v-if="status == 'needs_otp'">
      <v-dialog v-model="dialog2" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ otp_message }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                label="You need to enter your OTP to continue"
                hint="one time pin sent to your device"
                persistent-hint
                v-model="extra.otp"
                required
              ></v-text-field>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="
                dialog = false;
                Ready();
              "
            >
              COntinue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-alert
      v-if="status == 'Charge Complete'"
      dismissible
      icon="mdi-check"
      type="success"
      prominent
    >
      Payment of {{ currency }}{{ amount_to_pay }} was successful
    </v-alert>
    <v-row justify="center" v-if="status == 'needs_noauth_international'">
      <v-dialog v-model="dialog3" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"
              >Billing Adress details needed for your mastercard</span
            >
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row justify="center" xs6 md3>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field
                    label="Billing Address"
                    hint="Billing Address"
                    persistent-hint
                    v-model="extra.billingaddress"
                    required
                  ></v-text-field>
                </v-col>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field
                    label="Billing State"
                    hint="Billing State"
                    persistent-hint
                    v-model="extra.billingstate"
                    required
                  ></v-text-field>
                </v-col>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field
                    label="Billing City"
                    hint="Billing city"
                    persistent-hint
                    v-model="extra.billingcity"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center" xs6 md3>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field
                    label="Billing Zip"
                    hint="Billing Zip"
                    persistent-hint
                    v-model="extra.billingzip"
                    required
                  ></v-text-field>
                </v-col>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field
                    label="Billing Country"
                    hint="Billing country"
                    persistent-hint
                    v-model="extra.billingcountry"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="
                dialog = false;
                PassData(types[tab], {
                  suggested_auth: 'NOAUTH_INTERNATIONAL',
                });
              "
            >
              COntinue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row v-if="status == 'needs_otp_frame'" justify="center">
      <v-container>
        <iframe :src="url" style="height: 400px; width: 100%"></iframe>
      </v-container>
    </v-row>
  </div>
</template>
<script>
export default {
  props: [
    "amount_to_pay",
    "currency",
    "status",
    "url",
    "card_error",
    "card_has_error",
    "otp_message",
  ],
  data() {
    return {
      s_valid: false,
      dialog1: true,
      dialog2:true,
      dialog3:true,
      card_value: "5438898014560229",
      cardRules: [
        (v) =>
          v.toString().length >= 16 || "The 16 digit pin in front of your card",
      ],
      cvvRules: [
        (v) => v.toString().length == 3 || "The 3 digit pin behind your card",
      ],
      tab: "",
      cvv: "564",
      types: ["card", "mpesa", "ghana_mobile_money", "bank_transfer"],
      months: new Array(12).fill(0).map((x, index) => ({
        month: index < 9 ? `0${index + 1}` : index + 1,
        val: index + 1,
      })),
      years: new Array(20).fill(0).map((x, index) => ({
        year: 2020 + index,
        val: 20 + index,
      })),
      card_month: "10",
      card_year: "31",
      nameRules: [(v) => !!v || "This Field is required"],
      extra: {
        otp: "",
        pin: "",
        billingstate: "",
        billingcountry: "",
        billingzip: "",
        billingaddress: "",
        billingcity: "",
      },
    };
  },
  methods: {
    PassData(card, more) {
      this.$emit("pass", {
        card: this.card_value,
        card_month: this.card_month,
        card_year: this.card_year,
        cvv: this.cvv,
        type: card,
        ...this.extra,
        ...more,
      });
    },
    Ready() {
      this.$emit("finish", {
        otp: this.extra.otp,
      });
    },
  },
};
</script>
