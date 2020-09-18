import React from "react";

import ListOfImages from "./ListOfImages/ListOfImages";
import classes from "./Shop.module.css";

const Home = (props) => {
  return (
    <div className={classes.Home}>
      <ListOfImages />
    </div>
  );
};

export default Home;
