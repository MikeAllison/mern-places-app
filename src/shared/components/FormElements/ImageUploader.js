import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';

import './ImageUploader.css';

const ImageUploader = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const fileChooserRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    // Triggered when the fileReader is finished parsing the file
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const choosenHandler = (event) => {
    let chosenFile;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      chosenFile = event.target.files[0];
      setFile(chosenFile);
      setIsValid(true); // Is scheduled to update which is why we are also using fileIsValid = true
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, chosenFile, fileIsValid);
  };

  // Used to trigger the select function of the file input element
  const chooseImageHandler = () => {
    fileChooserRef.current.click();
  };

  return (
    <div className="form-control">
      {/* This is hidden but is needed to choose the file from the OS */}
      <input
        id={props.id}
        ref={fileChooserRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={choosenHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>Please choose an image.</p>}
        </div>
        <Button type="button" onClick={chooseImageHandler}>
          CHOOSE IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
