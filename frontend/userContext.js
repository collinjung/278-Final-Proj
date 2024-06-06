import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserUUID, setLoggedInUserUUID] = useState(null);
  const [hostStatus, setHostStatus] = useState(null);
  const [addPost, setAddPost] = useState(0);
  //   const [loggedInFollowingProfiles, setLoggedInFollowingProfiles] =
  //     useState(null);
  //   const [loggedInFollowerProfiles, setLoggedInFollowerProfiles] =
  //     useState(null);
  //   const [posted, setPosted] = useState(false);

  return (
    <UserContext.Provider
      value={{
        loggedInUserId,
        setLoggedInUserId,
        loggedInUserUUID,
        setLoggedInUserUUID,
        hostStatus,
        setHostStatus,
        addPost,
        setAddPost,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
