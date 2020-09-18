import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Avatar } from "@material-ui/core";

import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { makeStyles } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";

import classes from "./NavigationBar.module.css";
import gallery from "../../apis/gallery";

const useStyles = makeStyles((theme) => ({
  avatar: {
    // color: theme.palette.getContrastText(deepOrange[900]),
    backgroundColor: deepOrange["A400"],
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  userSpecificMenu: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const NavigationBar = ({
  isAuthenticated,
  userId,
  token,
  logout,
  setUser,
  user,
  setUserProfileImage,
  userProfileImage,
}) => {
  const classesMUI = useStyles();

  const [displayUserSpecificMenu, setDisplayUserSpecificMenu] = useState(false);

  useEffect(() => {
    if (token && userId) {
      gallery
        .get(`/users/${userId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const user = response.data.data.user;

          if (user) {
            setUser(user);
            setUserProfileImage(user.profileImageUrl);
          }
        })
        .catch((err) => {
          // const arr = err.message.split(" ");
          // const statusCode = arr[arr.length - 1];
          // if (statusCode === "500") {
          //   logout();
          // }
        });
    }
  }, [userId, setUser, token, setUserProfileImage]);

  const showAvatarAccordingly = (avatarClass) => {
    if (user.profileImageUrl) {
      return <Avatar src={userProfileImage} className={avatarClass} />;
    }

    return (
      <Avatar className={classesMUI.avatar}>
        <PersonOutlineIcon />
      </Avatar>
    );
  };

  const showNavigationAccordingly = () => {
    if (isAuthenticated()) {
      let totalCartItems = 0;

      if (user.firstName) {
        totalCartItems = user.cart.totalItems;
      }

      return (
        <div className={classes.Links}>
          <Link to="/">
            <Typography variant="body1">Shop</Typography>
          </Link>

          <div className={classes.shoppingCart}>
            <Link to="/cart">
              <ShoppingCartIcon />
              <div className={classes.totalCartItems}>{totalCartItems}</div>
            </Link>
          </div>

          <Link
            to="/user"
            onMouseEnter={() => setDisplayUserSpecificMenu(true)}
            onMouseLeave={() => setDisplayUserSpecificMenu(false)}
          >
            {showAvatarAccordingly(classesMUI.medium)}
          </Link>
        </div>
      );
    } else {
      return (
        <div className={classes.Links}>
          <Link to="/">
            <Typography variant="body1">Shop</Typography>
          </Link>
          <Link to="/signup">
            <Typography variant="body1">Sign Up</Typography>
          </Link>
          <Link to="login">
            <Typography variant="body1">Log In</Typography>
          </Link>
        </div>
      );
    }
  };

  let userName;

  if (user.firstName) {
    userName = user.firstName + " " + user.lastName;
  }

  const displayOnHoverUserProfile = () => {
    if (displayUserSpecificMenu) {
      return (
        <div
          className={classes.userSpecificMenu}
          onMouseEnter={() => setDisplayUserSpecificMenu(true)}
          onMouseLeave={() => setDisplayUserSpecificMenu(false)}
        >
          <div className={classes.userSpecificMenu__Header}>
            <div className={classes.userImage}>
              {showAvatarAccordingly(classesMUI.large)}
            </div>

            <div className={classes.userInfo}>
              <p className={classes.userName}>{userName}</p>

              <span className={classes.userEmail}>{user.email}</span>
            </div>
          </div>

          <hr />

          <div className={classes.userSpecificMenu__Main}>
            <div className={classes.userSpecificMenu__Main_Link}>
              <Link to="/sellYourImage">Sell Your Image</Link>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <Link to="/user/images">My Images</Link>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <Link to="/user/profile/image">Change Profile Image</Link>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <Link to="/cart">My Cart</Link>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <button className={classes.Logout} onClick={logout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={classes.NavigationBar}>
      {showNavigationAccordingly()}
      {displayOnHoverUserProfile()}
    </div>
  );
};

export default NavigationBar;
