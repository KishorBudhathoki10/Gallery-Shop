import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, Typography } from "@material-ui/core";

import classes from "./ProfileImageForm.module.css";
import ImageUploader from "../../../components/ImageUploader/ImageUploader";
import gallery from "../../../apis/gallery";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(50),
    height: theme.spacing(50),
    display: "inline-block",
    marginBottom: "2rem",
    marginTop: "2rem",
  },
  button: {
    marginTop: "2rem",
  },
}));

const ProfileImageForm = ({ userId, token, setUserProfileImage, logout }) => {
  const classesMUI = useStyles();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [failUpload, setFailUplaod] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const history = useHistory();

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    // Here onload is called once fileReader.readAsDataURL(file) functions fineshes reading the file
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  const saveProfileImage = () => {
    const formData = new FormData();

    formData.append("profileImage", file);

    gallery
      .post(`/users/${userId}/profileImage`, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setFailUplaod(false);
        setErrMessage(null);
        setUserProfileImage(response.data.data.userProfileUrl);
        history.push("/");
      })
      .catch((err) => {
        const arr = err.message.split(" ");
        const statusCode = arr[arr.length - 1];
        setFailUplaod(true);

        if (statusCode === "422") {
          return setErrMessage(
            "Image size too big. Maximum size of 2MB is Allowed."
          );
        } else if (statusCode === "500") {
          logout();
        }

        return setErrMessage("Please provide a valid Image.");
      });
  };

  const showAvatarAccordingly = () => {
    if (previewUrl) {
      return <Avatar src={previewUrl} className={classesMUI.large} />;
    }

    return <Avatar className={classesMUI.large} />;
  };

  const showErrorAccordingly = () => {
    if (failUpload) {
      return <div className={classes.error}>{errMessage}</div>;
    }

    return null;
  };

  return (
    <div className={classes.ProfileImageForm}>
      <Typography variant="h6" component="h2" color="primary">
        Please choose a your Profile Image.
      </Typography>

      {showErrorAccordingly()}

      {showAvatarAccordingly()}
      <ImageUploader setFile={setFile} />

      <Button
        variant="contained"
        color="primary"
        className={classesMUI.button}
        onClick={saveProfileImage}
      >
        Save Image
      </Button>
    </div>
  );
};

export default ProfileImageForm;
