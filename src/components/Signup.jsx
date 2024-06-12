import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import enGB from "date-fns/locale/en-GB";
import { toast } from "react-toastify";
import InputField from "./InputField";
import MessageBox from "./MessageBox";
import {
  validateEmail,
  validateName,
  validatePassword,
  handleAddingUser,
  validateBirthday,
} from "../utils/helpers";
import { LuLoader2 } from "react-icons/lu";
import GoogleButton from "./GoogleButton";

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

  useEffect(() => {
    setLoginError(null);
  }, [formData.email, formData.password]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!validateEmail(formData.email)) errors.email = "Email is not valid";
    if (!validateName(formData.name)) errors.name = "Name is not valid";
    if (!validatePassword(formData.password)) {
      errors.password =
        "Password needs to be at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number.";
    }
    if (typeof validateBirthday(formData.birthday) === "string") {
      errors.birthday = validateBirthday(formData.birthday);
    }
    else{
      console.log(validateBirthday(formData.birthday), formData.birthday)
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
        const user = userCredential.user;
        const { error } = await handleAddingUser(
          user,
          formData.name,
          formData.email,
          formData.birthday,
          formData.clothingPreference
        );

        if (error) {
          throw new Error(error);
        } else {
          toast("Sign up is successful!");
          navigate("/shop");
        }
      } catch (error) {
        setLoginError({ errorMessage: error.message });
        toast(error.message, { type: "error" });
      } finally {
        setSignUpLoading(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { error } = await handleAddingUser(
        user,
        formData.name,
        formData.email,
        formData.birthday,
        formData.clothingPreference
      );

      if (error) {
        throw new Error(error);
      } else {
        toast("Sign up with Google successful!");
        navigate("/shop");
      }
    } catch (error) {
      setLoginError({ errorMessage: error.message });
      toast(error.message, { type: "error" });
    }
  };

  return (
    <div className="w-full h-full overflow-y-scroll">
      <div className="justify-center items-center flex">
        <div className="w-96 flex flex-col text-center my-10">
          <p className="text-3xl font-semibold mb-3">Join Us!</p>
          <p className="mb-5 text-sm text-slate-800 font-semibold">
            Have an account?{" "}
            <Link to={"/login"}>
              <span className="cursor-pointer text-blue-600">Login</span>
            </Link>
          </p>
          <GoogleButton onClick={handleGoogleSignUp} />
          <div className="bg-slate-300 w-full h-lineBreakHeight my-6" />
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
              <div className="w-full">
                <p className="text-sm mb-2">Birthday</p>
                <DatePicker
                  selected={formData.birthday}
                  onChange={(date) => handleChange("birthday", date)}
                  className="w-full"
                  customInput={
                    <input
                      placeholder={"Birthday"}
                      className="w-full h-11 bg-transparent border-2 outline-none border-slate-300 pl-3 rounded-[10px] text-sm placeholder-slate-500 font-semibold"
                      type="text"
                    />
                  }
                  dateFormat="dd/MM/yyyy"
                  wrapperClassName="w-full"
                  locale={"en-GB"}
                />
                <p
                  className={`text-sm text-red-600 ${
                    formErrors.birthday === "" ? "hidden" : "block"
                  }`}
                >
                  {formErrors.birthday}
                </p>
              </div>
            </div>
            <InputField
              data={formData.password}
              setData={(value) => handleChange("password", value)}
              error={formErrors.password}
              label={"Password"}
              placeholder={"Create a secure password"}
              type={"password"}
            />
            <div className="relative">
              <InputField
                data={formData.clothingPreference}
                setData={(value) => handleChange("clothingPreference", value)}
                label={"Clothing preferences"}
                placeholder={"Mens/Womans"}
                type={"dropdown"}
                dropdownFunc={() => setShowDropdown((prev) => !prev)}
              />
              <div
                className={`absolute shadow-md bg-white flex-col w-full rounded-lg h-20 overflow-y-scroll top-20 text-sm font-semibold ${
                  showDropdown ? "flex" : "hidden"
                }`}
              >
                {["Mens", "Womans"].map((choice) => (
                  <div
                    className="px-5 py-2 flex gap-3 cursor-pointer"
                    onClick={() => handleChange("clothingPreference", choice)}
                    key={choice}
                  >
                    <p>{choice}</p>
                  </div>
                ))}
              </div>
            </div>
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
          {logInError && (
            <MessageBox type="error" message={logInError.errorMessage} />
          )}
        </div>
      </div>
    </div>
  );
}
