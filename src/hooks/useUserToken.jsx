import React, { useState, useEffect, useContext } from "react";

export default function useUserToken(user) {
  const [userToken, setUserToken] = useState(null);
  async function handleGetUserToken() {
    try {
      const userToken = await user.getIdToken();
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
    else if(user===false){
      setUserToken(false)
    }
    else{
        setUserToken(null)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    
  }, [user]);

  useEffect(()=>{
    console.log("user token:",userToken)
  },[userToken])

  return userToken;
}
