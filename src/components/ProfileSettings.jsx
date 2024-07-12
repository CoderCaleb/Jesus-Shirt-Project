import React, { useState, useContext, useEffect, useRef } from "react";
import InputField from "./InputField";
import {
  validateEmail,
  validateName,
  validatePassword,
  handleGetUserInfo,
} from "../utils/helpers";
import { StateSharingContext } from "../contexts";
import DropdownInput from "./DropdownInput";
import DateInput from "./DateInput";
export default function ProfileSettings() {
  const [profileUpdates, setProfileUpdates] = useState({
    name: "",
    clothingPreference: "",
    birthday: "",
    shippingAddress: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [shippingData, setShippingData] = useState({});
  const [apiError, setApiError] = useState({});
  const fetchedProfileInfo = useRef(null);

  const { user, userToken } = useContext(StateSharingContext);

  const handleChange = (field, value) => {
    setProfileUpdates((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleApiErrors = (field, error) => {
    setApiError((prev) => ({ ...prev, [field]: error }));
  };
  const validateForm = (formData) => {
    const errors = {};
    if (!validateEmail(formData.email)) errors.email = "Email is not valid";
    if (!validateName(formData.name)) errors.name = "Name is not valid";
    if (!validatePassword(formData.password)) {
      errors.password =
        "Password needs to be at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number.";
    }
    setFormErrors(errors);
  };

  async function handleUpdateProfile(profileUpdates) {
    const response = await fetch("http://127.0.0.1:4242/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileUpdates),
    });
    const updatedProfileData = await response.json();
    if (!response.ok) {
      return { error: updatedProfileData.error };
    }
    return { data: updatedProfileData.data };
  }

  useEffect(() => {
    if (user) {
      handleGetUserInfo(user?.uid, user, userToken, setProfileUpdates).then(
        (res) => {
          console.log("profile data:", res);
          if (res.error) {
            handleApiErrors("fetchProfileDataError", res.error);
          } else {
            setProfileUpdates(res.data);
            fetchedProfileInfo.current = res.data
          }
        }
      );
    }
  }, [userToken]);
  return (
    <div>
      <div>
        <p className="font-semibold text-lg mb-2">Profile</p>
        <p className=" text-slate-700">
          This is how others will see you on the site.{" "}
        </p>
      </div>
      <div className=" bg-slate-400 w-full h-lineBreakHeight mt-7" />
      <div>
        <p className="font-semibold my-5">Edit profile</p>
        <div className="flex flex-col gap-8">
          <InputField
            setData={(value) => handleChange("name", value)}
            data={profileUpdates?.name}
            label={"Name"}
            placeholder={"Your name"}
            error={formErrors.name}
            additionalStyles={"max-w-[750px]"}
          />
          <InputField
            data={profileUpdates?.email}
            label={"Email"}
            placeholder={"Your email"}
            additionalStyles={"max-w-[750px]"}
            type={"info"}
          />
          <DateInput
            formData={profileUpdates}
            handleChange={handleChange}
            formErrors={formErrors}
            additionalStyles={"max-w-[750px]"}
          />{" "}
          <DropdownInput
            choices={["Mens", "Womens", "No preference"]}
            data={profileUpdates.clothingPreference}
            setData={(value) => {
              handleChange("clothingPreference", value);
            }}
            label={"Clothing preference"}
            placeholder={"Mens/Womans"}
            additionalStyles={"max-w-[750px]"}
          />
        </div>
        <button
          className="border-2 px-3 py-2 mt-8 font-semibold text-sm rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
          onClick={() => {
            handleUpdateProfile(profileUpdates).then((res) => {
              if (res.error) {
                handleApiErrors("updateProfileError", res.error);
              } else if (res.data) {
                setProfileUpdates((prev) => ({ ...prev, ...res.data }));
              }
            });
          }}
        >
          Update profile
        </button>
      </div>
      <div className=" bg-slate-400 w-full h-lineBreakHeight my-7" />
      <div className="">
        <p className="font-semibold mb-5">Update account</p>
        <div className="flex gap-3">
          <button
            className="border-2 px-3 py-2 font-semibold text-sm rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={() => validateForm(profileUpdates)}
          >
            Password reset
          </button>
          <button
            className="border-2 px-3 py-2 font-semibold text-sm rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={() => validateForm(profileUpdates)}
          >
            Change email
          </button>
        </div>
      </div>
    </div>
  );
}
