import React from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";

import classes from "./Image.module.css";

const Image = ({ image }) => {
  const history = useHistory();

  const showImageDetail = () => {
    history.push(`/images/${image._id}`);
  };

  return (
    <div className={classes.Image}>
      <div className={classes.imageContainer} onClick={showImageDetail}>
        <img src={image.imageUrl} alt={image.title} />
      </div>

      <div className={classes.content}>
        <Typography variant="h6" component="h2">
          {image.title}
        </Typography>
        <Typography variant="body1" component="p">
          {image.price} €
        </Typography>
      </div>
    </div>
  );
};

export default Image;
