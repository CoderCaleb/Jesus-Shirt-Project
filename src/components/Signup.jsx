import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import DropdownInput from "./DropdownInput";
import enGB from "date-fns/locale/en-GB";
import { toast } from "react-toastify";
import InputField from "./InputField";
import MessageBox from "./MessageBox";
import DateInput from "./DateInput";

import {
  handleAddingUser,
  validateFields,
} from "../utils/helpers";
import { LuLoader2 } from "react-icons/lu";
import GoogleButton from "./GoogleButton";
import useQuery from "../hooks/useQuery";

registerLocale("en-GB", enGB);

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    clothingPreference: "Mens",
    birthday: new Date(),
  });
  const [formErrors, setFormErrors] = useState({});
  const [logInError, setLoginError] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const from = query.get("from");
  const state = query.get("state");
  const orderId = query.get("orderId");
  const orderToken = query.get("orderToken");
  useEffect(() => {
    setLoginError(null);
  }, [formData.email, formData.password]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const validateForm = () => {
    const fieldsToValidate = ["email", "name", "password", "birthday"];
    return validateFields(fieldsToValidate, setFormErrors, formData);
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      setSignUpLoading(true);
      const auth = getAuth();

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        if (from !== "order-tracking") {
          navigate("/shop");
          return;
        }
        const user = userCredential.user;
        const { error } = await handleAddingUser(
          user,
          formData.name,
          formData.email,
          formData.birthday,
          formData.clothingPreference,
          orderToken,
          orderId,
          state
        );

        if (error) {
          throw new Error(error);
        } else {
          toast("Sign up is successful!", { type: "success" });
          navigate(`/orders/${orderId}`);
        }
      } catch (error) {
        signOut(auth).then(() => {
          setLoginError({ errorMessage: error.message });
          toast(error.message, { type: "error" });
        });
      } finally {
        setSignUpLoading(false);
      }
    }
  };

  const DisplayPromptFromState = () => {
    const style = "text-sm text-slate-700 font-semibold";
    if (
      state === "not-authenticated-no-linked-user" ||
      state === "authenticated-no-linked-user"
    ) {
      return (
        <p className={style}>
          {`Sign up to view order ${
            orderId || ""
          } and connect it to your account.`}
        </p>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="w-full h-full overflow-y-scroll">
      <div className="justify-center items-center flex">
        <div className="w-96 flex flex-col text-center my-10">
          <p className="text-3xl font-semibold mb-3">Join Us!</p>
          <DisplayPromptFromState />
          <div className="bg-slate-300 w-full h-lineBreakHeight my-4" />
          <div className="flex flex-col gap-3 text-left">
            <InputField
              data={formData.email}
              setData={(value) => handleChange("email", value)}
              error={formErrors.email}
              label={"Email"}
              placeholder={"larrytan@gmail.com"}
              type="email"
            />
            <div className="flex gap-5 w-full">
              <InputField
                data={formData.name}
                setData={(value) => handleChange("name", value)}
                error={formErrors.name}
                label={"Name"}
                placeholder={"Caleb Tan"}
              />
              <DateInput
                formData={formData}
                handleChange={handleChange}
                formErrors={formErrors}
              />
            </div>
            <InputField
              data={formData.password}
              setData={(value) => handleChange("password", value)}
              error={formErrors.password}
              label={"Password"}
              placeholder={"Create a secure password"}
              type={"password"}
            />
            <DropdownInput
              choices={["Mens", "Womens", "No preference"]}
              data={formData.clothingPreference}
              setData={(value) => {
                handleChange("clothingPreference", value);
                console.log(value);
              }}
              label={"Clothing preference"}
              placeholder={"Mens/Womans"}
            />
          </div>
          <div className="pt-5">
            <button
              className="border-2 w-full h-12 font-semibold rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
              onClick={handleSignUp}
            >
              {!signUpLoading ? (
                "Sign up"
              ) : (
                <LuLoader2
                  className="m-auto animate-spin"
                  size="25"
                  color="white"
                />
              )}
            </button>
          </div>
          <p className="mt-5 text-sm text-slate-800 font-semibold">
            Have an account?{" "}
            <Link
              to={
                from === "order-tracking" &&
                (state === "not-authenticated-no-linked-user" ||
                  state === "authenticated-no-linked-user")
                  ? `/login?from=order-tracking&state=${state}&orderId=${orderId}&orderToken=${orderToken}`
                  : "/login"
              }
            >
              <span className="cursor-pointer text-blue-600 mt-5">Login</span>
            </Link>
          </p>
          {logInError && (
            <MessageBox type="error" message={logInError.errorMessage} />
          )}
        </div>
      </div>
    </div>
  );
}
