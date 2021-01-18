/*jshint -W014 */
export const state = () => ({
  goods: [],
  staging: {},
  country:"NG"
});

export const actions = {
  ADD_OR_REMOVE({ commit }, product) {
    commit("ADD_OR_REMOVE", product);
  }
};
/*jshint -W018*/
export const mutations = {
  ADD_OR_REMOVE(state, product) {
    // if the good has not been added to the cart already
    let old = state.goods;
    if (!old.filter(good => good._id == product._id).length > 0) {
      state.goods = [...state.goods, product];
      state.staging[product._id] = true;
    } else {
        //remove from the cart
        state.goods = state.goods.filter(good => good._id != product._id)
        state.staging[product._id] = false;
    }
  },
  SET_COUNTRY(state, country) {
    state.country = country
  }
};
export const getters = {
  // displayStatus:(state)=> {
  //     return state.goods.filter(good=>good._id==product.id).length==0?"Add To Cart":"Remove from Cart"
  // }
};
