import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import classes from "./ImageCard.module.css";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));

const ImageCard = ({
  title,
  description,
  price,
  photoBy,
  createdAt,
  imageUrl,
}) => {
  const classesMUI = useStyles();

  let choppedDescription;

  if (description) {
    choppedDescription = description.slice(0, 100);
  }

  return (
    <div className={classes.ImageCard}>
      <Card className={classes.card}>
        <div className={classes.header}>
          <div className={classes.title}>
            <h2>{title}</h2>
          </div>
          <div className={classes.photoBy}>
            <span className={classes.span__item}>Photo By:</span> {photoBy}
          </div>
          <div className={classes.price}>
            <span className={classes.span__item}>Price:</span> {price}
          </div>
        </div>
        <CardMedia
          className={classesMUI.media}
          image={imageUrl}
          title="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {choppedDescription} ...
          </Typography>
        </CardContent>

        <div className={classes.price}>
          <div></div>
        </div>
      </Card>
    </div>
  );
};

export default ImageCard;
