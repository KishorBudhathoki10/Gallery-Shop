import React from "react";

import classes from "./Filter.module.css";

const Filter = ({
  setMinPrice,
  setMaxPrice,
  setSortBy,
  maxPrice,
  minPrice,
}) => {
  const handleMinPrice = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className={classes.Filter}>
      <div className={classes.sortByContainer}>
        Sort By
        <select
          name="sortBy"
          className={classes.select}
          onChange={handleSortBy}
        >
          <option value="">Default</option>
          <option value="price">Min to Max</option>
          <option value="-price">Max to Min</option>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
        </select>
      </div>

      <div className={classes.minContainer}>
        Min Price
        <select
          name="minPrice"
          value={minPrice}
          className={classes.select}
          onChange={handleMinPrice}
        >
          <option value="0">0 €</option>
          <option value="500">500 €</option>
          <option value="1000">1000 €</option>
          <option value="2000">2000 €</option>
          <option value="3000">3000 €</option>
          <option value="4000">4000 €</option>
          <option value="4999">4999 €</option>
        </select>
      </div>

      <div className={classes.maxContainer}>
        Max Price
        <select
          name="maxPrice"
          className={classes.select}
          value={maxPrice}
          onChange={handleMaxPrice}
        >
          <option value="500">500 €</option>
          <option value="1000">1000 €</option>
          <option value="2000">2000 €</option>
          <option value="3000">3000 €</option>
          <option value="4000">4000 €</option>
          <option value="4999">4999 €</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
