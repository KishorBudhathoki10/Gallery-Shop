import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import classes from "./UserImages.module.css";
import gallery from "../../../apis/gallery";
import ImageCard from "./ImageCard/ImageCard";

const UserImages = ({ userId, token }) => {
  const [images, setImages] = useState([]);

  const history = useHistory();

  useEffect(() => {
    gallery
      .get(`/users/${userId}/images`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setImages(response.data.data.images);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [token, userId, history]);

  const imageCollection = images.map((image) => (
    <ImageCard
      key={image._id}
      title={image.title}
      description={image.description}
      photoBy={image.photoBy}
      createdAt={image.createdAt}
      imageUrl={image.imageUrl}
      price={image.price}
    />
  ));

  return (
    <div className={classes.UserImages}>
      <div className={classes.workOnProgress}>
        Work On Progress. Not yet Completed.
      </div>
      {imageCollection}
    </div>
  );
};

export default UserImages;
