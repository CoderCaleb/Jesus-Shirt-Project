import React, { useState, useEffect, useContext } from "react";
import { StateSharingContext } from "../App";

export default function useUserToken(user) {
  const [userToken, setUserToken] = useState("");
  async function handleGetUserToken() {
    try {
      const userToken = await user.getIdToken();
      console.log("userToken:", userToken);
      return userToken;
    } catch (error) {
      console.error("Error fetching user token:", error);
      throw error;
    }
  }
  function handleUserTokenData() {
    handleGetUserToken().then((userToken) => {
      if (userToken) {
        setUserToken(userToken);
      }
      else{
        setUserToken(null)
      }
    });
  }
  useEffect(() => {
    let intervalId;
    if (user) {
      handleUserTokenData();
      intervalId = setInterval(() => {
        handleUserTokenData();
      }, 60 * 55 * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user]);

  return userToken;
}
