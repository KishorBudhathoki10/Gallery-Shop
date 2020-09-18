import React, { useEffect, useState } from "react";

import classes from "./Product.module.css";
import gallery from "../../../apis/gallery";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

const Product = ({ imageId, quantity, setTotal }) => {
  const classesMUI = useStyles();

  const [image, setImage] = useState({});

  useEffect(() => {
    gallery
      .get(`/images/${imageId}`)
      .then((response) => {
        const image = response.data.data.image;
        setImage(image);
        setTotal((prevTotal) => prevTotal + image.price * quantity);
      })
      .catch((err) => {});
  }, [imageId, quantity, setTotal]);

  return (
    <div className={classes.Product}>
      <div className={classes.image}>
        <Avatar
          variant="square"
          alt={image.title}
          src={image.imageUrl}
          className={classesMUI.large}
        />
      </div>

      <div className={classes.content}>
        <h2 className={classes.title}>{image.title}</h2>
        <p className={classes.stock}>In Stock</p>

        <div className={classes.quantity}>
          Quantity: <span>{quantity}</span>
        </div>

        <div className={classes.price}>
          <h2>{image.price} €</h2>
          <p>Per Unit</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
