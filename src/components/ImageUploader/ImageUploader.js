import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classes from "./ImageUploader.module.css";

const ImageUploader = ({ setFile, uploadText }) => {
  const text = uploadText || "Upload";

  const ref = useRef();

  const pickedHandler = (e) => {
    const files = e.target.files;

    if (files && files.length === 1) {
      const pickedFile = files[0];
      setFile(pickedFile);
      return;
    }
  };

  return (
    <div>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        type="file"
        ref={ref}
        onChange={pickedHandler}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="default" component="span">
          <CloudUploadIcon />
          <span className={classes.ButtonText}>{text}</span>
        </Button>
      </label>
    </div>
  );
};

export default ImageUploader;
