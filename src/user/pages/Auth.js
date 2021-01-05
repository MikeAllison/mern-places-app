import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './Auth.css';

import { AuthContext } from '../../shared/context/auth-context';

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
      // SIGNIN MODE
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          {
            'Content-Type': 'application/json'
          },
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        );

        auth.login(responseData.user.id);
      } catch (err) {
        // Error is handeled in the sendRequest useHttpClient hook
        // Could also use a .then() instead of try/catch
      }
    }
  };

  const switchModeHandler = (event) => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined },
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
          password: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
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
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputChangeHandler}
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputChangeHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(10)]}
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
