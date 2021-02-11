import React from "react";
import CartItem from "./CartItem";
import "./CartItems.css";

function CartItems({ items }) {
  console.log(items);
  return (
    <div className="CartItems">
      <h1>Shopping Cart</h1>
      <hr />
      <div className="CartItems-items">
        {items.map((item, index) => (
          <CartItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default CartItems;
