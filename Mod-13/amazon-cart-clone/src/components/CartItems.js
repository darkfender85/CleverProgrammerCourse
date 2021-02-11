import React from "react";
import CartItem from "./CartItem";
import "./CartItems.css";

function CartItems({ items, setCart }) {
  const changeItemQuantity = (event, itemIndex) => {
    let value = event.target.value;
    if (value) items[itemIndex].quantity = value;
    else items.splice(itemIndex, 1);
    setCart([...items]);
  };

  return (
    <div className="CartItems">
      <h1>Shopping Cart</h1>
      <hr />
      <div className="CartItems-items">
        {items.map((item, index) => (
          <CartItem
            key={index}
            index={index}
            {...item}
            changeItemQuantity={changeItemQuantity}
          />
        ))}
      </div>
    </div>
  );
}

export default CartItems;
