import React, { useState, useContext, useEffect, useRef } from "react";
import InputField from "./InputField";
import {
  validateEmail,
  validateName,
  validatePassword,
  handleGetUserInfo,
  isEmptyObject,
  validateFields,
} from "../utils/helpers";
import { StateSharingContext } from "../contexts";
import DropdownInput from "./DropdownInput";
import DateInput from "./DateInput";
import { findDifferentKeys } from "../utils/helpers";
import { toast } from "react-toastify";
export default function ProfileSettings() {
  const [profileUpdates, setProfileUpdates] = useState({
    name: "",
    clothingPreference: "",
    birthday: "",
    shippingAddress: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState({});
  const [triggerRef, setTriggerRef] = useState(0)
  const fetchedProfileInfo = useRef(null);

  const { user, userToken } = useContext(StateSharingContext);

  const profileChanges = fetchedProfileInfo.current
    ? findDifferentKeys(fetchedProfileInfo.current, profileUpdates)
    : {};
  const profileChangesNotEmpty = !isEmptyObject(profileChanges);

  console.log(fetchedProfileInfo.current?.birthday, profileUpdates.birthday)

  const handleChange = (field, value) => {
    setProfileUpdates((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleApiErrors = (field, error) => {
    setApiError((prev) => ({ ...prev, [field]: error }));
  };
  const validateForm = () => {
    const fieldsToValidate = ["name", "clothingPreference", "birthday"];
    return validateFields(fieldsToValidate, setFormErrors, profileUpdates);
  };
  
  async function handleUpdateProfile() {
    console.log("validateform:", validateForm());
    if(validateForm()){
        try {
            const response = await fetch("http://127.0.0.1:4242/update-profile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              body: JSON.stringify({
                profileChanges,
                uid: user.uid,
              }),
            });
            const updatedProfileData = await response.json();
            console.log(updatedProfileData);
            if (!response.ok) {
              const error = updatedProfileData.error;
              toast.error(error);
              handleApiErrors("updateProfileError", error);
            } else {
              console.log("updatedProfileData.data:",updatedProfileData.data)
              fetchedProfileInfo.current = {...fetchedProfileInfo.current,...updatedProfileData.data}
              setTriggerRef(triggerRef+1)
              toast.success("Profile updated successfully");
            }
          } catch (e) {
            toast.error(e);
          }
    }
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
            fetchedProfileInfo.current = res.data;
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
      {fetchedProfileInfo.current ? (
        <div>
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
              className={
                profileChangesNotEmpty
                  ? "border-2 px-3 py-2 mt-8 font-semibold text-sm rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
                  : "border-2 px-3 py-2 mt-8 font-semibold text-sm rounded-[10px] border-[#E5E5E5] bg-[#E5E5E5] text-gray-500 cursor-not-allowed"
              }
              onClick={() => {
                if (profileChangesNotEmpty) {
                  handleUpdateProfile(profileUpdates);
                }
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
