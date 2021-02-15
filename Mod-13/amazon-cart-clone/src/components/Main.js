import React, { useState } from "react";
import CartTotal from "./CartTotal";
import CartItems from "./CartItems";
import "./Main.css";
import data from "./../Data";

function Main() {
  const [cartItems, setCartItems] = useState(data);

  return (
    <div className="App-main">
      <CartItems items={cartItems} setCart={setCartItems} />
      <CartTotal items={cartItems} />
    </div>
  );
}

export default Main;
