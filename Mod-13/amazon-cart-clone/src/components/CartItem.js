import React from "react";
import "./CartItem.css";

function CartItem() {
  return (
    <div className="CartItem">
      <div className="CartItem-image">
        <img src="/items/item-1.jpg" />
      </div>
      <div className="CartItem-info">
        <div className="info-title">
          <h2>Apple iPad Pro Max</h2>
        </div>
        <div className="info-stock">In Stock</div>
        <div className="item-actions">
          <div className="item-quantity">
            <select>
              <option value="1">Q.ty 1</option>
              <option value="2">Q.ty 2</option>
              <option value="3">Q.ty 3</option>
            </select>
          </div>
          <div className="item-delete"></div>
        </div>
      </div>
      <div className="CartItem-price">$ 799.00</div>
    </div>
  );
}

export default CartItem;
