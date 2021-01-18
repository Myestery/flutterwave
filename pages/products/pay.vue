<template>
    <div>
        <flutterwave-pay-button
        style="margin-top:20%"
        :tx_ref="generateReference()"
        :amount=20
        currency='USD'
        debit_currency='NGN'
        payment_options="card,mobilemoneyghana"
        redirect_url="http://localhost:3000/api/users/tester"
        class="class-name"
        :meta="{counsumer_id: '7898' ,consumer_mac: 'kjs9s8ss7dd' }"
        :customer="{ name: 'Demo Customer  Name',
        email: 'customer@mail.com', 
        phone_number: '0818450****' }"
        :customizations="{  title: 'Customization Title' ,
        description: 'Customization Description'  ,
        logo : 'https://flutterwave.com/images/logo-colored.svg' }"
        :callback="makePaymentCallback"
        :onclose="closedPaymentModal"
    >   Click To Pay </flutterwave-pay-button>
    </div>
</template>
<script>
export default {
    name: 'App',
    auth:false,
  methods: {
    makePaymentCallback(response) {
      console.log("Payment callback", response)
    },
    closedPaymentModal() {
      console.log('payment modal is closed');
    },
    generateReference(){
      let date = new Date()
      return date.getTime().toString();
    }
  }
}
</script>