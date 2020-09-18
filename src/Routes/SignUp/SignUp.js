import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  InputAdornment,
  IconButton,
  Typography,
  Container,
  Avatar,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useFormik } from "formik";
import * as Yup from "yup";

import gallery from "../../apis/gallery";
import classes from "./SignUp.module.css";

const useStyles = makeStyles((theme) => ({
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

const SignUp = (props) => {
  const { login } = props;

  const classesMUI = useStyles();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);

  const history = useHistory();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const showPasswordAccordingly = () => {
    if (passwordVisible) {
      return <Visibility />;
    }

    return <VisibilityOff />;
  };

  const showPasswordConfirmAccordingly = () => {
    if (passwordConfirmVisible) {
      return <Visibility />;
    }

    return <VisibilityOff />;
  };

  const showTextOrPasswordAccordingly = (visiblility) => {
    return visiblility ? "text" : "password";
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .min(2, "Minimum of 2 letters is required.")
        .required("First Name is required"),
      lastName: Yup.string()
        .trim()
        .min(2, "Minimum of 2 letters is required.")
        .required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email address.")
        .required("Email address is required"),
      password: Yup.string()
        .min(8, "Password must contain minimum of 8 characters.")
        .required("Password is required"),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please Confirm your password."),
    }),
    onSubmit: (values) => {
      gallery
        .post("/users/signup", values)
        .then((response) => {
          login(response.data.data.userId, response.data.token);

          setEmailAlreadyExists(false);

          history.push("/user/profile/image");
        })
        .catch((err) => {
          const length = err.message.split(" ").length;
          const statusCode = err.message.split(" ")[length - 1];

          if (statusCode === "409") {
            setEmailAlreadyExists(true);
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

  const displayErrorAccordingly = () => {
    if (emailAlreadyExists) {
      return (
        <div className={classes.error}>
          This email already has an account. Please choose another email.
        </div>
      );
    }

    return null;
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "8rem" }}>
      {displayErrorAccordingly()}

      <div className={classesMUI.paper}>
        <Avatar className={classesMUI.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h6">
          Sign up
        </Typography>
        <form
          className={classesMUI.form}
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                error={anyError(
                  formik.touched.firstName,
                  formik.errors.firstName
                )}
                helperText={formFieldError(
                  formik.touched.firstName,
                  formik.errors.firstName
                )}
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                required
                {...formik.getFieldProps("firstName")}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                error={anyError(
                  formik.touched.lastName,
                  formik.errors.lastName
                )}
                helperText={formFieldError(
                  formik.touched.lastName,
                  formik.errors.lastName
                )}
                autoComplete="lname"
                required
                {...formik.getFieldProps("lastName")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                error={anyError(formik.touched.email, formik.errors.email)}
                helperText={formFieldError(
                  formik.touched.email,
                  formik.errors.email
                )}
                required
                label="Email Address"
                name="email"
                autoComplete="email"
                {...formik.getFieldProps("email")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                required
                name="password"
                label="Password"
                type={showTextOrPasswordAccordingly(passwordVisible)}
                id="password"
                error={anyError(
                  formik.touched.password,
                  formik.errors.password
                )}
                helperText={formFieldError(
                  formik.touched.password,
                  formik.errors.password
                )}
                {...formik.getFieldProps("password")}
                InputProps={{
                  classes: {
                    root: classesMUI.font,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                      >
                        {showPasswordAccordingly()}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                required
                name="passwordConfirm"
                label="Password Confirm"
                type={showTextOrPasswordAccordingly(passwordConfirmVisible)}
                id="passwordConfirm"
                error={anyError(
                  formik.touched.passwordConfirm,
                  formik.errors.passwordConfirm
                )}
                helperText={formFieldError(
                  formik.touched.passwordConfirm,
                  formik.errors.passwordConfirm
                )}
                {...formik.getFieldProps("passwordConfirm")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordConfirmVisibility}
                      >
                        {showPasswordConfirmAccordingly()}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" className={classes.linkTOLogin}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
