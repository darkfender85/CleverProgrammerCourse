import React from "react";
import CartTotal from "./CartTotal";
import CartItems from "./CartItems";
import "./Main.css";

function Main() {
  return (
    <div className="App-main">
      <CartItems />
      <CartTotal />
    </div>
  );
}

export default Main;
