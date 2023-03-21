import React, { useState } from "react";
import { useEffect } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import UsersList from "../components/UsersList";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const sendDataRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:4000/api/users");
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        console.log(responseData.totalUsers);
        setLoadedUsers(responseData.totalUsers);
      } catch (err) {
        setIsError(err);
      }
      setIsLoading(false);
    };
    sendDataRequest();
  }, []);

  const onClearHandler = () => {
    setIsError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={isError} onClear={onClearHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
