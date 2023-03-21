import React, { useContext } from "react";
import "./NewPlace.css";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/AuthContext";

import { useFormHook } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useHistory, useParams } from "react-router-dom";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const DUMMY_DATA = [
  {
    id: "u1",
    title: "Taj Mahal",
    imageURL:
      "https://images.unsplash.com/photo-1523131328515-865dbf27fe0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2062&q=80",
    description: "One of the 7 wonders of the world",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    location: {
      lat: 27.1751,
      lng: 78.0421,
    },
    creator: "u1",
  },
  {
    id: "u1",
    title: "Taja Mahal",
    imageURL:
      "https://images.unsplash.com/photo-1508196476590-9511757a5cbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80",
    description: "One of the 7 wonders of the world",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    location: {
      lat: 27.1751,
      lng: 78.0421,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const context = useContext(AuthContext);
  const history = useHistory();
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useFormHook(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const findPlace = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/places/${placeId}`
        );
        const responseData = await response.json();
        setLoadedPlace(responseData.places);
        setFormData(
          {
            title: {
              value: responseData.places.title,
              isValid: true,
            },
            description: {
              value: responseData.places.description,
              isValid: true,
            },
          },
          true
        );
        setIsLoading(false);
      } catch (err) {
        setIsError(err.message);
        setIsLoading(false);
      }
    };
    findPlace();
  }, [placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    const uid = context.userId;
    event.preventDefault();
    setIsLoading(true);

    try {
      await fetch(`http://localhost:4000/api/places/${placeId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);
      history.push(`/${uid}/places`);
    } catch (err) {
      setIsLoading(false);
      setIsError(err.message);
    }
  };

  const clearError = () => {
    setIsError(null);
  };
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!loadedPlace && !isError) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }
  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            value={loadedPlace.title}
            initialValid={true}
          />
          {console.log(loadedPlace.title)}
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            value={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={false}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
