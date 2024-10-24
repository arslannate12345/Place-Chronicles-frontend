import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UsersList from "../compoents/UsersList";
import { useHttpClient } from "../../shared/Hooks/http-hook";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users",
          "GET"
        );
        if (isMounted) {
          setLoadedUsers(responseData.users);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err); // Optional: log errors
        }
      }
    };
    fetchUsers();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [sendRequest]);

  // const USERS = [
  //   {
  //     id: "u1",
  //     name: "Tom Hardy",
  //     image:
  //       "https://media.gettyimages.com/id/138557086/photo/premiere-of-twentieth-century-foxs-this-means-war-arrivals.jpg?s=612x612&w=gi&k=20&c=o_3qkC22TRShKZdKFch2bzU6w__sVTQ4cCo9fGx0lds=",
  //     places: 3,
  //   },
  //   {
  //     id: "u2",
  //     name: "Eminem",
  //     image:
  //       "https://images.squarespace-cdn.com/content/v1/593070a42994cad2710a6439/deb20dbc-e941-4d08-b239-fd1a125ac9ab/zzz.jpeg",
  //     places: 4,
  //   },
  // ];

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
