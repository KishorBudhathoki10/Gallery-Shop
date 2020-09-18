import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button } from "@material-ui/core";

import classes from "./SellYourImage.module.css";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import gallery from "../../apis/gallery";

import { InputAdornment, Container, TextField, Grid } from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import AccountCircle from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(30),
    height: theme.spacing(30),
    display: "inline-block",
    marginBottom: "2rem",
    marginTop: "2rem",
  },
  button: {
    marginTop: "2rem",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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

  const showAvatarAccordingly = () => {
    if (previewUrl) {
      return (
        <Avatar
          src={previewUrl}
          className={classesMUI.large}
          variant="rounded"
        />
      );
    }

    return <Avatar className={classesMUI.large} variant="rounded" />;
  };

  const showErrorAccordingly = () => {
    if (failUpload) {
      return <div className={classes.error}>{errMessage}</div>;
    }

    return null;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      price: 0,
      description: "",
      photoBy: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .min(3, "Minimum of 2 letters is required.")
        .required("Title is required"),
      price: Yup.string()
        .matches(
          /^[1-4][0-9]?[0-9]?[0-9]?$/,
          "Please enter a valid price. Maximum of 4999 € is allowed."
        )
        .min(1, "0 is invalid")
        .max(4, "Maximum amount is 9999 €")
        .required("Last Name is required"),
      photoBy: Yup.string().required("Name of photographer is required"),
      description: Yup.string()
        .min(20, "Description must contain minimum of 20 characters.")
        .max(600, "Description can only contain 600 characters."),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("image", file);

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      gallery
        .post("/images", formData, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setFailUplaod(false);
          history.push("/user/images");
        })
        .catch((err) => {
          const length = err.message.split(" ").length;
          const statusCode = err.message.split(" ")[length - 1];
          if (statusCode.startsWith("4")) {
            setFailUplaod(true);
            setErrMessage("Invalid Image. Please provide a valid Image.");
          } else {
            logout();
          }
        });
    },
  });

  const anyError = (touched, errors) => (touched && errors ? true : false);

  const formFieldError = (touched, errors) => {
    if (touched && errors) {
      return errors;
    }

    return null;
  };

  return (
    <div className={classes.ProfileImageForm}>
      {showErrorAccordingly()}

      {showAvatarAccordingly()}
      <ImageUploader setFile={setFile} uploadText={"Upload Image"} />

      <Container component="main" maxWidth="xs">
        <div className={classesMUI.paper}>
          <form
            className={classesMUI.form}
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="title"
                  name="title"
                  variant="outlined"
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                  required
                  error={anyError(formik.touched.title, formik.errors.title)}
                  helperText={formFieldError(
                    formik.touched.title,
                    formik.errors.title
                  )}
                  {...formik.getFieldProps("title")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="price"
                  required
                  label="Price"
                  name="price"
                  autoComplete="price"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  error={anyError(formik.touched.price, formik.errors.price)}
                  helperText={formFieldError(
                    formik.touched.price,
                    formik.errors.price
                  )}
                  {...formik.getFieldProps("price")}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  rows={8}
                  autoComplete="description"
                  error={anyError(
                    formik.touched.description,
                    formik.errors.description
                  )}
                  helperText={formFieldError(
                    formik.touched.description,
                    formik.errors.description
                  )}
                  {...formik.getFieldProps("description")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  name="photoBy"
                  label="PhotoBy"
                  id="photoBy"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  error={anyError(
                    formik.touched.photoBy,
                    formik.errors.photoBy
                  )}
                  helperText={formFieldError(
                    formik.touched.photoBy,
                    formik.errors.photoBy
                  )}
                  {...formik.getFieldProps("photoBy")}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={`${classesMUI.submit}`}
            >
              Save Image
            </Button>
            <Grid container justify="flex-end">
              <Grid item></Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default ProfileImageForm;
