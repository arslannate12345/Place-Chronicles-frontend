import React, { useContext, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useHistory } from "react-router-dom";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/Hooks/form-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./PlaceForm.css";

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" }); // State for coordinates
  const [formState, inputChangeHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null, // Initialize as null to hold the File object
        isValid: false,
      },
    },
    false
  );

  // Function to update coordinates (could be from a map or input)
  const updateCoordinates = (lat, lng) => {
    setCoordinates({ lat, lng });
  };

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Ensure coordinates are set
      if (coordinates.lat === "" || coordinates.lng === "") {
        throw new Error("Coordinates must be set.");
      }

      // Ensure image is selected
      if (!formState.inputs.image.value) {
        throw new Error("Image must be selected.");
      }

      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);

      formData.append(
        "coordinates",
        JSON.stringify({
          lat: parseFloat(coordinates.lat),
          lng: parseFloat(coordinates.lng),
        })
      );

      formData.append("image", formState.inputs.image.value); // File object

      await sendRequest("http://localhost:5000/api/places", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push("/");
    } catch (err) {
      console.error("Error uploading place:", err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputChangeHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)"
          onInput={inputChangeHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputChangeHandler}
        />
        {/* Button to set coordinates */}
        <Button
          type="button"
          onClick={() => updateCoordinates(40.7128, -74.006)}
        >
          Set Coordinates
        </Button>
        <ImageUpload
          id="image"
          onInput={inputChangeHandler}
          errorText="Please Provide an Image!"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
