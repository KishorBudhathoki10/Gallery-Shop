import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
  }, [userId, setUser, token, setUserProfileImage, userProfileImage]);

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

  const styleActiveNavLink = {
    color: "black",
  };

  const styleUserSpecificActiveNavLink = {
    color: "#3b54f8",
  };

  const showNavigationAccordingly = () => {
    if (isAuthenticated()) {
      let totalCartItems = 0;

      if (user.firstName) {
        totalCartItems = user.cart.totalItems;
      }

      return (
        <div className={classes.Links}>
          <NavLink to="/" exact activeStyle={styleActiveNavLink}>
            <Typography variant="body1">Shop</Typography>
          </NavLink>

          <div className={classes.shoppingCart}>
            <NavLink to="/cart" activeStyle={styleActiveNavLink}>
              <ShoppingCartIcon />
              <div className={classes.totalCartItems}>{totalCartItems}</div>
            </NavLink>
          </div>

          <NavLink
            to="/user"
            onMouseEnter={() => setDisplayUserSpecificMenu(true)}
            onMouseLeave={() => setDisplayUserSpecificMenu(false)}
            onClick={() => setDisplayUserSpecificMenu(true)}
            activeStyle={styleActiveNavLink}
          >
            {showAvatarAccordingly(classesMUI.medium)}
          </NavLink>
        </div>
      );
    } else {
      return (
        <div className={classes.Links}>
          <NavLink to="/" exact activeStyle={styleActiveNavLink}>
            <Typography variant="body1">Shop</Typography>
          </NavLink>

          <NavLink to="/signup" activeStyle={styleActiveNavLink}>
            <Typography variant="body1">Sign Up</Typography>
          </NavLink>
          <NavLink to="login" activeStyle={styleActiveNavLink}>
            <Typography variant="body1">Log In</Typography>
          </NavLink>
        </div>
      );
    }
  };

  let userName;

  if (user.firstName) {
    userName = user.firstName + " " + user.lastName;
  }

  const onLogoutClick = () => {
    logout();
    setDisplayUserSpecificMenu(false);
  };

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
              <NavLink
                to="/sellYourImage"
                activeStyle={styleUserSpecificActiveNavLink}
                onClick={() => setDisplayUserSpecificMenu(false)}
              >
                Sell Your Image
              </NavLink>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <NavLink
                to="/user/images"
                activeStyle={styleUserSpecificActiveNavLink}
                onClick={() => setDisplayUserSpecificMenu(false)}
              >
                My Images
              </NavLink>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <NavLink
                to="/user/profile/image"
                activeStyle={styleUserSpecificActiveNavLink}
                onClick={() => setDisplayUserSpecificMenu(false)}
              >
                Change Profile Image
              </NavLink>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <NavLink
                to="/cart"
                activeStyle={styleUserSpecificActiveNavLink}
                onClick={() => setDisplayUserSpecificMenu(false)}
              >
                My Cart
              </NavLink>
            </div>

            <div className={classes.userSpecificMenu__Main_Link}>
              <button className={classes.Logout} onClick={onLogoutClick}>
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
