import React from "react";
import UserItem from "./UserItem";
import "./UsersList.css";
const UsersList = (props) => {
  if (props.items.length === 0) {
    return <h2>User List is empty</h2>;
  }
  return (
    <ul className="user-list">
      {props.items.map((item) => {
        return (
          <UserItem
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            placeCount={item.places.length}
          />
        );
      })}
    </ul>
  );
};

export default UsersList;
