import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";

import classes from "./Cart.module.css";
import Product from "./Product/Product";

const Cart = ({ setUser, user, name }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {}, [user]);

  let imagesCollection;

  if (Object.keys(user).length > 0) {
    imagesCollection = user.cart.items.map((item) => {
      return (
        <Product
          key={item.imageId}
          imageId={item.imageId}
          quantity={item.quantity}
          setTotal={setTotal}
        />
      );
    });
  }

  return (
    <div className={classes.Cart}>
      <div>{imagesCollection}</div>
      <div className={classes.total}>
        <div className={classes.total__text}>Total</div>
        <div className={classes.total__amount}>{total} €</div>
      </div>

      <div className={classes.buyNow}>
        <Button variant="contained" color="primary" fullWidth>
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default Cart;
