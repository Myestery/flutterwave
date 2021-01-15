export default function({ store, redirect }) {
  // If the user does not have a shop
  if (
    !(
      store.state.auth.user.hasOwnProperty("shop") &&
      store.state.auth.user.shop.hasOwnProperty("_id")
    )
  ) {
    return redirect("/products");
  }
}
