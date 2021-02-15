import React from "react";
import "./CartTotal.css";
import NumberFormat from "react-number-format";

function CartTotal({ items }) {
  const getTotalQuantity = () =>
    items.reduce((total, item) => (total += item.quantity), 0);

  const getTotalPrice = () => {
    let result = items.reduce(
      (total, item) => (total += item.price * item.quantity),
      0
    );

    return result;
  };

  return (
    <div className="CartTotal">
      <h3>
        Subtotal({getTotalQuantity()} items):
        <span className="CartTotal-price">
          <NumberFormat
            value={getTotalPrice()}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            //renderText={(value) => <div>{value}</div>}
            decimalScale={2}
          />
        </span>
      </h3>
      <button>Proceed to checkout</button>
    </div>
  );
}

export default CartTotal;
