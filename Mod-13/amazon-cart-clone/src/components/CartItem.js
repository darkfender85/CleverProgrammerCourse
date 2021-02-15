import React from "react";
import "./CartItem.css";

function CartItem({
  index,
  title,
  stock,
  image,
  price,
  quantity,
  changeItemQuantity,
}) {
  return (
    <div className="CartItem">
      <div className="CartItem-image">
        <img src={"/items/" + image} />
      </div>
      <div className="CartItem-info">
        <div className="info-title">
          <h2>{title}</h2>
        </div>
        <div className="info-stock">{stock}</div>
        <div className="item-actions">
          <div className="item-quantity">
            <select
              value={quantity}
              onChange={(e) => changeItemQuantity(e, index)}
            >
              <option value="1">Q.ty 1</option>
              <option value="2">Q.ty 2</option>
              <option value="3">Q.ty 3</option>
            </select>
          </div>
          <div className="item-actions-divider">|</div>
          <div
            className="item-delete"
            value={0}
            onClick={(e) => changeItemQuantity(e, index)}
          >
            Delete
          </div>
        </div>
      </div>
      <div className="CartItem-price">$ {price}</div>
    </div>
  );
}

export default CartItem;
