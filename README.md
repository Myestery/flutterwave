# flutterwave
Chiwetelu Johnpaul's solution to the jumga shopping challenge. 

# How to Test
The live implementation of this code is hosted on heroku
At https://jumga-by-jp.herokuapp.com.
You can also pull this repository and run
```npm install```
```npm run dev```
send a post request to '/seedDatabase' to get the accounts of dispatch riders

# Softwares / Technology employed
`Nuxtjs`
###
`Vuejs`
###
`Vuetify`
###
*Ui template by https://madewithvuejs.com/shipit*
###
Flutterwave node express sdk
###
Flutterwave vue v3 helper

# Getting started
A seller can signup via the link /register-as-merchant. 
Immediately his payment is processed,it sends
a copy of the data from the transaction to the seller

The fee for opening a shop just as instructed is $20
This platform highly depends on test accounts so these test accounts are solely left for the dispatch riders
`0690000031`
`0690000032`
`0690000033`
`0690000033`

# How to buy
Click on the handbag icon above, select a product , add to cart and then proceed to checkout
The checkout was made using split transactions and sub account ids,
so you must have signed up using areal test account as it will be validated.

# How to add Goods
go to /shop with a logged in account
press the add goods button

# Sharing formula
For shop opening fee payments, i used the normal flutterwave checkout card payments
for cart/goods buying, i used split accounts

