<template>
  <div>
    <v-card color="basil">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold display-2 basil--text">Payment Options</h1>
      </v-card-title>

      <v-tabs v-model="tab" grow>
        <v-tab v-for="card in ['card', 'mpesa', 'Ghana Mobile Money', 'Bank (Nigerian Users Only)']" :key="card">
          {{ card }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="card in ['card', 'mpesa', 'Ghana Mobile Money', 'Bank (Nigerian Users Only)']" :key="card">
          <v-card color="basil" flat>
            <v-form v-model="s_valid">
              <v-card>
                <v-card-title> Pay {{currency}}{{amount_to_pay}} with {{card}} </v-card-title>
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
                  <v-btn color="info">Pay Now</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
export default {
    props:["amount_to_pay","currency"],
  data() {
    return {
      s_valid: false,
      card_value: "",
      cardRules: [
        (v) =>
          v.toString().length >= 16 || "The 16 digit pin in front of your card",
      ],
      cvvRules: [
        (v) => v.toString().length == 3 || "The 3 digit pin behind your card",
      ],
      tab: "",
      cvv: "",
      months: new Array(12).fill(0).map((x, index) => ({
        month: index < 9 ? `0${index + 1}` : index + 1,
        val: index + 1,
      })),
      years: new Array(11).fill(0).map((x, index) => ({
        year: 2020 + index,
        val: 20 + index,
      })),
      card_month: "",
      card_year: "",
    nameRules: [(v) => !!v || "This Field is required"],
    };
  },
};
</script>