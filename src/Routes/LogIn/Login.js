import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useFormik } from "formik";
import * as Yup from "yup";

import gallery from "../../apis/gallery";
import classes from "./Login.module.css";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LogIn = (props) => {
  const { login } = props;

  const classesMUI = useStyles();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fetchingUserFail, setFetchingUserFail] = useState(false);
  const [formValues, setFormValues] = useState({});

  const history = useHistory();

  useEffect(() => {
    const postLogin = async () => {
      try {
        const response = await gallery.post("/users/login", formValues);

        login(response.data.data.userId, response.data.token);

        setFetchingUserFail(false);

        history.push("/");
      } catch (err) {
        if (err) {
          setFetchingUserFail(true);
        }
      }
    };

    if (Object.keys(formValues).length !== 0) {
      postLogin();
    }
  }, [formValues, history, login]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const displayPasswordAccordingly = () => {
    if (passwordVisible) {
      return <Visibility />;
    }

    return <VisibilityOff />;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email address.")
        .required("Email address is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      setFormValues(values);
    },
  });

  const anyError = (touched, errors) => (touched && errors ? true : false);

  const formFieldError = (touched, errors) => {
    if (touched && errors) {
      return errors;
    }

    return null;
  };

  const showUserValidationFailAccordingly = () => {
    if (fetchingUserFail) {
      return (
        <div className={classes.userValidationFail}>
          Please provide valid email and password.
        </div>
      );
    }

    return null;
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "8rem" }}>
      {showUserValidationFailAccordingly()}

      <CssBaseline />
      <div className={classesMUI.paper}>
        <Avatar className={classesMUI.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h6">
          Sign in
        </Typography>
        <form
          className={classesMUI.form}
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={anyError(formik.touched.email, formik.errors.email)}
            helperText={formFieldError(
              formik.touched.email,
              formik.errors.email
            )}
            {...formik.getFieldProps("email")}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={passwordVisible ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            error={anyError(formik.touched.password, formik.errors.password)}
            helperText={formFieldError(
              formik.touched.password,
              formik.errors.password
            )}
            {...formik.getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                  >
                    {displayPasswordAccordingly()}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={`${classesMUI.submit}`}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="#" className={classes.reactRouterLink}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" className={classes.reactRouterLink}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
export default LogIn;
