/*jshint -W014 */
export const state = () => ({
  goods: [],
  staging: {},
  country: "NG",
  total: 0,
  shipping_total: 0,
  amount_to_pay:0
});

export const actions = {
  ADD_OR_REMOVE({ commit }, product) {
    commit("ADD_OR_REMOVE", product);
  },
  EMPTY({ commit }) {
    commit("EMPTY");
  },
};
/*jshint -W018*/
export const mutations = {

  SET_COUNTRY(state, country) {
    state.country = country;
  },
  EMPTY(state) {
    state.goods = [];
  },
  ADD_OR_REMOVE(state, product) {
    // if the good has not been added to the cart already
    let old = state.goods;
    if (!old.filter(good => good._id == product._id).length > 0) {
      state.goods = [...state.goods, {...product,qty:1}];
      state.staging[product._id] = true;
      state.total = state.goods.length ? state.goods.map(x => x.price*x.qty).reduce((x, y) => x + y) : 0
      state.shipping_total = state.goods.length ? state.goods.map(x => x.shipping_cost*x.qty).reduce((x, y) => x + y) : 0
      state.amount_to_pay = state.total + state.shipping_total
    } else {
      //remove from the cart
      state.goods = state.goods.filter(good => good._id != product._id);
      state.staging[product._id] = false;
      state.total = state.goods.length >0? state.goods.map(x => x.price*x.qty).reduce((x, y) => x + y) : 0
      state.shipping_total = state.goods.length ? state.goods.map(x => x.shipping_cost*x.qty).reduce((x, y) => x + y) : 0
      state.amount_to_pay = state.total + state.shipping_total
    }
    
  },
  updateQuantity(state, obj) {
    let old = state.goods;
    let product = obj.product;
    let old_qty = product.qty
    let index;
    for (let i = 0; i < old.length; i++) {
      if (old[i]._id == product._id) {
        index = i;
        break;
      }
    }
    state.goods[index] = { ...product, qty: parseInt(obj.value) }
    state.total = state.goods.length ? state.goods.map(x => x.price*x.qty).reduce((x, y) => x + y) : 0
    state.shipping_total = state.goods.length ? state.goods.map(x => x.shipping_cost*x.qty).reduce((x, y) => x + y) : 0
    state.amount_to_pay = state.total + state.shipping_total
  }
};
export const getters = {
  getTotal( state ) {
    return state.goods.length? state.goods.map((x) => x.price * x.qty).reduce((x, y) => x + y): 0;
  }
};
