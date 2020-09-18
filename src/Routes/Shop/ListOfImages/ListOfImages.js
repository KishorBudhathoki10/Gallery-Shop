import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import gallery from "../../../apis/gallery";
import Image from "./Image/Image";
import classes from "./ListOfImages.module.css";
import Filter from "./Filter/Filter";

const useStyles = makeStyles({
  button: {
    display: "block",
    margin: "1rem",
  },
});

const ListOfItems = () => {
  const classesMUI = useStyles();

  const [images, setImages] = useState([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4999);
  const [sortBy, setSortBy] = useState("");

  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      const images = await gallery.get(
        `/images?price[gte]=${minPrice}&price[lte]=${maxPrice}`,
        {
          params: {
            sort: sortBy,
          },
        }
      );

      setImages(images.data.data.images);
    };

    try {
      getImages();
    } catch (err) {}
  }, [sortBy, minPrice, maxPrice]);

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const displayFilterAccordingly = () => {
    if (filterVisible) {
      return (
        <div className={classes.FilterContainer}>
          <Filter
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      );
    }
  };

  const imageCollection = images.map((image) => (
    <Image key={image._id} image={image} />
  ));

  return (
    <div className={classes.ListOfItems}>
      <Button
        onClick={toggleFilter}
        color="primary"
        variant="contained"
        display="block"
        component="button"
        classes={{
          root: classesMUI.button,
        }}
      >
        Filter
      </Button>
      {displayFilterAccordingly()}
      {imageCollection}
    </div>
  );
};

export default ListOfItems;
