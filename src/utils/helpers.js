import useFetch from "../hooks/useFetch";
import { parse, isValid, differenceInYears, isBefore } from "date-fns";

export const safelyParseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export const calculatePrices = (products, shippingPrice) => {
  const productPrice = products
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);
  const totalPrice = (
    parseFloat(productPrice) + parseFloat(shippingPrice)
  ).toFixed(2);
  return {
    productPrice: Number(productPrice),
    totalPrice: Number(totalPrice),
    shippingPrice: Number(shippingPrice),
  };
};

export const handleGetUserInfo = async (uid, user, userToken, setUserInfo) => {
  try {
    if (user && uid && userToken) {
      const response = await fetch(
        `http://127.0.0.1:4242/get-user?uid=${user.uid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = await response.json();
      if(!response.ok||!result){
        return {error:result.error}
      }
      setUserInfo(result);
      return {data:result}
    } else {
      setUserInfo(null);
      return {error:"Not authenticated"}
    }
  } catch (error) {
    console.log(error);
    setUserInfo(null);
  }
};
// File: utils.js
export const handleAddingUser = async (
  user,
  signUpName,
  signUpEmail,
  signUpBirthday,
  signUpClothingPreference,
  orderToken,
  orderId,
  state,
) => {
  if (!user) {
    return { error: "User not provided" };
  }

  try {
    const userToken = await user.getIdToken();
    const url = "http://127.0.0.1:4242/add-user";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
        "Order-Token": orderToken,
      },
      body: JSON.stringify({
        uid: user.uid,
        name: signUpName,
        email: signUpEmail,
        birthday: signUpBirthday,
        clothingPreference: signUpClothingPreference,
        orderNumber: orderId,
        orderToken,
        state,
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`${data.error}`);
    }

    const data = await response.json();

    return { data };
  } catch (error) {
    return { error: `${error.message}` };
  }
};


export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export function validateName(name) {
  const regex = /^[a-zA-Z\s]*$/;
  return name.trim() !== "" && regex.test(name);
}

export function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

export function validateBirthday(birthday) {
  const today = new Date();
  const age = differenceInYears(today, birthday);

  if (isBefore(birthday, new Date(1900, 0, 1))) {
    return "Birthday cannot be before January 1, 1900";
  }

  if (age < 10) {
    return "You must be at least 10 years old to sign up";
  }

  if (isBefore(today, birthday)) {
    return "Birthday cannot be in the future";
  }

  return true;
}

export function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatExpirationDate(expMonth, expYear) {
  const formattedMonth = expMonth < 10 ? `0${expMonth}` : expMonth;
  const formattedYear = expYear.toString().slice(-2);
  const formattedDate = `${formattedMonth}/${formattedYear}`;
  return formattedDate;
}

export function addDaysToDate(date, days) {
  const result = new Date(date); // Create a new Date object to avoid modifying the original date
  result.setDate(result.getDate() + days); // Add the specified number of days to the date
  return result; // Return the new date
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const checkCheckoutComplete = (number, checkoutProgress) =>
  checkoutProgress >= number;
