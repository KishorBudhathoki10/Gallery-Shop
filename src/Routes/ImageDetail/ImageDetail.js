import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
// import Button from "@material-ui/core/Button";
import classes from "./ImageDetail.module.css";
import gallery from "../../apis/gallery";

const ImageDetail = ({ userId, setUser, user, isAuthenticated, logout }) => {
  const [image, setImage] = useState({});
  const [potrait, setPotrait] = useState(false);

  const ref = useRef();

  const history = useHistory();

  useEffect(() => {
    const settingImageHeightAndWidth = () => {
      if (ref.current) {
        const height = ref.current.clientHeight;
        const width = ref.current.clientWidth;

        if (height > width) {
          setPotrait(true);
        } else {
          setPotrait(false);
        }
      }
    };

    ref.current.addEventListener("load", settingImageHeightAndWidth);
  }, []);

  useEffect(() => {
    const imageId = window.location.pathname.split("/")[2];

    gallery
      .get(`/images/${imageId}`)
      .then((response) => {
        if (Object.keys(response.data.data.image).includes("imageUrl")) {
          setImage(response.data.data.image);
        } else {
          history.push("/");
        }
      })
      .catch((err) => {
        history.push("/");
      });
  }, [setImage, history]);

  let classesForImageFrame = `${classes.imageFrame} ${classes.imageFrameLandscape}`;
  let classesForImageDisplay = `${classes.imageLandscape} ${classes.image}`;

  if (potrait) {
    classesForImageDisplay = `${classes.imagePotrait} ${classes.image}`;
    classesForImageFrame = `${classes.imageFrame} ${classes.imageFramePotrait}`;
  }

  let imageDescription;

  if (Object.keys(image).length > 1) {
    if (image.description) {
      imageDescription = image.description
        .split("\n")
        .map((paragraph, index) => {
          if (index === 0) {
            return (
              <p key={index}>
                <span className={classes.description}>Description:</span>{" "}
                {paragraph}
              </p>
            );
          }
          return <p key={index}>{paragraph}</p>;
        });
    }
  }

  const addToCartHandler = () => {
    if (isAuthenticated()) {
      const imageID = image._id;

      const index = user.cart.items.findIndex(
        (item) => item.imageId === imageID
      );

      if (index > -1) {
        user.cart.items[index].quantity += 1;
      } else {
        user.cart.items.push({ imageId: imageID, quantity: 1 });
      }

      gallery
        .patch(`/users/${userId}`, { cart: user.cart })
        .then((response) => {
          setUser(response.data.data.user);
        })
        .catch((err) => {
          const arr = err.message.split(" ");
          const statusCode = arr[arr.length - 1];

          if (statusCode === "500") {
            logout();
          }
        });
    } else {
      history.push("/login");
    }
  };

  return (
    <div className={classes.imageDetail}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={7}>
          <div className={classes.imageContainer}>
            <div className={classesForImageFrame}>
              <p className={classes.imageFrameWidth}>40cm</p>
              <p className={classes.imageFrameHeight}>50cm</p>
              <div className={classesForImageDisplay}>
                <img alt={image.title} src={image.imageUrl} ref={ref} />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={5}>
          <div className={classes.imageDetailContainer}>
            <div className={classes.imageTitle}>{image.title}</div>
            <div className={classes.imageDescription}>
              {imageDescription}

              <p>
                <span className={classes.description}>PhotoBy:</span>{" "}
                {image.photoBy}
              </p>
            </div>
            <div className={classes.chooseImageSize}>
              <div className={classes.chooseImageSize__header}>
                Choose Image Size:
              </div>

              <div className={classes.chooseImageSize__main}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <div className={classes.chooseImageSize__btn}>
                      40cm * 50cm
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className={classes.chooseImageSize__btn}>
                      60cm * 90cm
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className={classes.chooseImageSize__btn}>
                      100cm * 150cm
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className={classes.chooseImageSize__btn}>
                      120cm * 180cm
                    </div>
                  </Grid>
                </Grid>
              </div>

              <div className={classes.imageChoosenFormat}>
                <Grid
                  container
                  spacing={3}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={6}>
                    <h2 className={classes.imageChoosenFormat__name}>
                      Classic
                    </h2>
                    <h4 className={classes.imageChoosenFormat__size}>
                      40cm * 50cm
                    </h4>
                  </Grid>

                  <Grid item xs={6}>
                    <div className={classes.imagePrice}>{image.price} €</div>
                  </Grid>
                </Grid>
              </div>

              <div className={classes.addToCart} onClick={addToCartHandler}>
                Add To Cart
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ImageDetail;
