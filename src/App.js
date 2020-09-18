import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import "./App.css";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Shop from "./Routes/Shop/Shop";
import SignUp from "./Routes/SignUp/SignUp";
import LogIn from "./Routes/LogIn/Login";
import ProtectedRoute from "./protectedRoute";
import ProfileImageForm from "./Routes/User/ProfileImageForm/ProfileImageForm";
import SellYourImage from "./Routes/SellYourImage/SellYourImage";
import Cart from "./Routes/Cart/Cart";
import ImageDetail from "./Routes/ImageDetail/ImageDetail";
import UserImages from "./Routes/User/UserImages/UserImages";

const App = () => {
  const [token, setToken] = useState(localStorage.token || null);
  const [userId, setUserId] = useState(localStorage.userId || null);
  const [user, setUser] = useState({});
  const [userProfileImage, setUserProfileImage] = useState(null);

  const login = (userId, token) => {
    setToken(token);
    setUserId(userId);
    const expirationDate = new Date(
      new Date().getTime() + 1 * 24 * 60 * 60 * 1000
    );
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expirationDate", expirationDate);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationDate");
    setUser({});
    setUserProfileImage(null);
  };

  const isAuthenticated = () => {
    if (token && userId && localStorage.expirationDate) {
      const validToken = new Date(localStorage.expirationDate) > new Date();

      if (!validToken) {
        logout();
        return false;
      }

      return true;
    }

    return false;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar
          isAuthenticated={isAuthenticated}
          userId={userId}
          token={token}
          logout={logout}
          setUser={setUser}
          user={user}
          setUserProfileImage={setUserProfileImage}
          userProfileImage={userProfileImage}
        />

        <Switch>
          <Route path="/" exact component={Shop} />

          <Route path="/signup" component={() => <SignUp login={login} />} />
          <Route path="/login" component={() => <LogIn login={login} />} />

          <Route
            path="/images/:id"
            exact
            component={() => (
              <ImageDetail
                userId={userId}
                setUser={setUser}
                user={user}
                isAuthenticated={isAuthenticated}
                logout={logout}
              />
            )}
          />

          <ProtectedRoute
            path="/sellYourImage"
            component={SellYourImage}
            isAuthenticated={isAuthenticated}
            token={token}
            logout={logout}
          />

          <ProtectedRoute
            path="/user/images"
            component={UserImages}
            isAuthenticated={isAuthenticated}
            userId={userId}
            token={token}
          />

          <ProtectedRoute
            path="/cart"
            component={Cart}
            isAuthenticated={isAuthenticated}
            user={user}
            setUser={setUser}
          />

          <ProtectedRoute
            path="/user/profile/image"
            component={ProfileImageForm}
            logout={logout}
            userId={userId}
            token={token}
            setUserProfileImage={setUserProfileImage}
            isAuthenticated={isAuthenticated}
          />

          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
