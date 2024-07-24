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

export const handleGetUserInfo = async (uid, user, userToken, setUserInfo, projection) => {
  try {
    if (user && uid && userToken) {
      const response = await fetch(
        `http://127.0.0.1:4242/get-user?uid=${user.uid}&projection=${JSON.stringify(projection)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok || !result) {
        return { error: result.error };
      }
      setUserInfo(result);
      return { data: result };
    } else {
      return { error: "Not authenticated" };
    }
  } catch (error) {
    console.log(error);
    return { error: error.message };
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
  navigatedFrom
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
        navigatedFrom
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.error||"An unexpected error occurred."}`);
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

function validateClothingPreference(clothingPreference) {
  const validPreferences = ["Mens", "Womens", "No preference"];
  return validPreferences.includes(clothingPreference);
}

export const validateFields = (fields, setErrors, data) => {
  const errors = {};

  const validations = {
    email: () => {
      if (!validateEmail(data.email)) {
        errors.email = "Email is not valid";
      }
    },
    newEmail: () => {
      if (!validateEmail(data.newEmail)) {
        errors.newEmail = "New email is not valid";
      }
    },
    name: () => {
      if (!validateName(data.name)) {
        errors.name = "Name is not valid";
      }
    },
    password: () => {
      if (!validatePassword(data.password)) {
        errors.password =
          "Password needs to be at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number.";
      }
    },
    birthday: () => {
      const birthdayError = validateBirthday(data.birthday);
      if (typeof birthdayError === "string") {
        errors.birthday = birthdayError;
      }
    },
    clothingPreference: () =>{
      if(!validateClothingPreference(data.clothingPreference)){
        errors.clothingPreference = "Clothing preference needs to be either Men/Woman/No Preference"
      };
    }
  };

  fields.forEach((field) => {
    if (validations[field]) {
      validations[field]();
    }
  });
  console.log("validation errors:",errors)
  setErrors(errors);
  return isEmptyObject(errors);
};


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

export function findDifferentKeys(dict1, dict2) {
  const differentFields = {};

  for (const key in dict1) {
    if (dict1.hasOwnProperty(key)) {
      if (dict2.hasOwnProperty(key)) {
        if (dict1[key] !== dict2[key]) {
          differentFields[key] = dict2[key];
        }
      } else {
        differentFields[key] = null; // Indicate that the key was removed
      }
    }
  }

  for (const key in dict2) {
    if (dict2.hasOwnProperty(key) && !dict1.hasOwnProperty(key)) {
      differentFields[key] = dict2[key];
    }
  }

  return differentFields;
}

export function isEmptyObject(dict){
  return Object.keys(dict).length === 0;
}

export const handleFieldChange = (setProfileUpdates, setFormErrors) => (field, value) => {
  console.log(field, value)
  setProfileUpdates((prev) => ({ ...prev, [field]: value }));
  setFormErrors((prev) => ({ ...prev, [field]: "" }));
};

export const handleFieldErrors = (setErrors) => (field, error) => {
  setErrors((prev) => ({ ...prev, [field]: error }));
};