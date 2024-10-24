import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/Hooks/http-hook";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    let isMounted = true;
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/users/${userId}`
        );

        if (isMounted) {
          console.log("Response Data:", responseData);
          if (responseData && responseData.places) {
            setLoadedPlaces(responseData.places);
          } else {
            throw new Error("Places not found in response");
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      }
    };
    fetchPlaces();

    return () => {
      isMounted = false;
    };
  }, [sendRequest, userId]);

  const deletePlaceHandler = (deletePlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletePlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
