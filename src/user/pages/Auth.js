import React, { useState, useContext } from 'react';

import { AuthContext } from '../../shared/context/auth-context';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import ImageUploader from '../../shared/components/FormElements/ImageUploader';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './Auth.css';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL
} from '../../shared/util/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          {
            'Content-Type': 'application/json'
          },
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        );

        auth.login(responseData.user.id);
      } catch (err) {
        // Error is handeled in the sendRequest useHttpClient hook
        // Could also use a .then() instead of try/catch
      }
    } else {
      // SIGNUP MODE
      try {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value);
        formData.append('image', formState.inputs.image.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          {},
          formData
        );

        auth.login(responseData.user.id);
      } catch (err) {
        // Error is handeled in the sendRequest useHttpClient hook
        // Could also use a .then() instead of try/catch
      }
    }
  };

  return (
    <React.Fragment>
      {/* error/clearError passed from useHttpClient */}
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? 'Login Required' : 'Sign-Up'}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputChangeHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUploader
              id="image"
              center
              onInput={inputChangeHandler}
              errorText={'Place provide an image.'}
            />
          )}
          <Input
            element="input"
            id="email"
            type="text"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputChangeHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(10)]}
            errorText="Please enter a password with a minimum of 10 characters."
            onInput={inputChangeHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGN-UP'}
          </Button>
        </form>
        <Button onClick={switchModeHandler} inverse>
          {isLoginMode ? 'SWITCH TO SIGN-UP' : 'SWITCH TO LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
