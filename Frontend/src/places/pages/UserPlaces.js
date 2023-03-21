import React from "react";
import PlaceList from "./PlaceList";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = (props) => {
  const [loadPlaces, setLoadPlaces] = useState();
  //   const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();

  const params = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/places/user/${params}`
        );
        const responseData = await response.json();
        setLoadPlaces(responseData.place);
        setIsLoading(false);
      } catch (err) {
        setIsError(err.message);
        setIsLoading(false);
      }
    };
    fetchPlaces();
  }, [setIsError, setIsLoading, params]);

  const clearError = () => {
    setIsError(null);
  };

  const PlaceDeleteHandler = (toBeDeleted) => {
    setLoadPlaces((prevPlaces) =>
      prevPlaces.filter((p) => p.id !== toBeDeleted)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadPlaces && (
        <PlaceList items={loadPlaces} onPlaceDelete={PlaceDeleteHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
