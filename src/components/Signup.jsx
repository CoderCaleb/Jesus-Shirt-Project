import React, { useState, useContext, useEffect } from "react";
import InputField from "./InputField";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import DatePicker, { registerLocale } from "react-datepicker";
import { LuLoader2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import enGB from "date-fns/locale/en-GB";
import { toast } from "react-toastify";
import MessageBox from "./MessageBox"

registerLocale("en-GB", enGB);

export default function Login() {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpEmailError, setSignUpEmailError] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPasswordError, setSignUpPasswordError] = useState("");
  const [signUpClothingPreference, setSignUpClothingPreference] =
    useState("Mens");
  const [signUpBirthday, setSignUpBirthday] = useState(new Date());
  const [signUpBirthdayError, setSignUpBirthdayError] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpNameError, setSignUpNameError] = useState("");
  const [logInError, setLoginError] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoginError(null);
  }, [signUpEmail, signUpPassword]);
  async function handleAddingUser(user) {
    try {
      if (!user) {
        return { error: "User not provided" };
      }
      const userToken = await user.getIdToken();
      console.log("userToken:", userToken);

      const response = await fetch("http://127.0.0.1:4242/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          name: signUpName,
          email: signUpEmail,
          birthday: signUpBirthday,
          clothingPreference: signUpClothingPreference,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: `Server error: ${errorData.error || response.statusText}. Try to reload to see if it solves the problem :)`,
        };
      }

      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.log(error);
      return { error: `Unexpected error: ${error.message}` };
    }
  }
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  function validateName(name) {
    const regex = /^[a-zA-Z\s]*$/;
    return name.trim() !== "" && regex.test(name);
  }
  function validatePassword(password) {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }
  return (
    <div className="w-full h-full overflow-y-scroll">
      <div className=" justify-center items-center flex">
        <div className="w-96 flex flex-col text-center my-10">
          <p className="text-3xl font-semibold mb-3">Join Us!</p>
          <p className="mb-5 text-sm text-slate-800 font-semibold">
            Have an account?{" "}
            <Link to={"/login"}>
              <span className="cursor-pointer text-blue-600">Login</span>
            </Link>
          </p>
          <button
            aria-label="Continue with Google"
            className="flex font-semibold justify-center items-center bg-white border border-button-border-light rounded-md p-0.5 pr-3"
            onClick={() => {
              const provider = new GoogleAuthProvider();
              const auth = getAuth();
              signInWithPopup(auth, provider)
                .then((result) => {
                  // This gives you a Google Access Token. You can use it to access the Google API.
                  const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                  const token = credential.accessToken;
                  // The signed-in user info.
                  const user = result.user;
                  handleAddingUser(user).then((response) => {
                    if (!response.error) {
                      toast("Sign up with google successful!")
                      navigate("/shop");
                    } else {
                      setLoginError({
                        errorMessage: response.error,
                      });
                    }
                  });
                  // IdP data available using getAdditionalUserInfo(result)
                  // ...
                })
                .catch((error) => {
                  // Handle Errors here.
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  // The email of the user's account used.
                  const email = error.customData.email;
                  // The AuthCredential type that was used.
                  const credential =
                    GoogleAuthProvider.credentialFromError(error);
                  setLoginError({
                    errorCode: errorCode,
                    errorMessage: errorMessage,
                  });
                });
            }}
          >
            <div className="flex items-center justify-center bg-white w-9 h-9 rounded-l">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <title>Sign up with Google</title>
                <desc>Google G Logo</desc>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  className="fill-google-logo-blue"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  className="fill-google-logo-green"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  className="fill-google-logo-yellow"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  className="fill-google-logo-red"
                ></path>
              </svg>
            </div>
            <span className="text-sm text-google-text-gray tracking-wider">
              Continue with Google
            </span>
          </button>
          <div className=" bg-slate-300 w-full h-lineBreakHeight my-6" />
          <div className="flex flex-col gap-3 text-left">
            <InputField
              data={signUpEmail}
              setData={setSignUpEmail}
              error={signUpEmailError}
              setError={setSignUpEmailError}
              label={"Email"}
              placeholder={"larrytan@gmail.com"}
              type="email"
            />
            <div className="flex gap-5 w-full">
              <InputField
                data={signUpName}
                setData={setSignUpName}
                error={signUpNameError}
                setError={setSignUpNameError}
                label={"Name"}
                placeholder={"Caleb Tan"}
              />
              <div className="w-full">
                <p className="text-sm mb-2">Birthday</p>

                <DatePicker
                  selected={signUpBirthday}
                  onChange={(date) => {
                    setSignUpBirthday(date);
                    setSignUpBirthdayError("");
                  }}
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
              </div>
            </div>
            <InputField
              data={signUpPassword}
              setData={setSignUpPassword}
              error={signUpPasswordError}
              setError={setSignUpPasswordError}
              label={"Password"}
              placeholder={"Create a secure password"}
              type={"password"}
            />
            <div className="relative">
              <InputField
                data={signUpClothingPreference}
                setData={setSignUpClothingPreference}
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
                {["Mens", "Womans"].map((choice, index) => {
                  return (
                    <div
                      className="px-5 py-2 flex gap-3 cursor-pointer"
                      onClick={() => {
                        setSignUpClothingPreference(choice);
                      }}
                    >
                      <p>{choice}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="pt-5">
            <button
              className="border-2 w-full h-12 font-semibold rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
              onClick={() => {
                const emailValid = validateEmail(signUpEmail);
                const nameValid = validateName(signUpName);
                const passwordValid = validatePassword(signUpPassword);

                if (!emailValid) {
                  setSignUpEmailError("Email is not valid");
                }
                if (!nameValid) {
                  setSignUpNameError("Name is not valid");
                }
                if (!passwordValid) {
                  setSignUpPasswordError(
                    "Password needs to be at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number."
                  );
                }
                if (emailValid && nameValid && passwordValid) {
                  setSignUpLoading(true);
                  const auth = getAuth();

                  createUserWithEmailAndPassword(
                    auth,
                    signUpEmail,
                    signUpPassword
                  )
                    .then((userCredential) => {
                      // Signed up
                      const user = userCredential.user;
                      handleAddingUser(user).then((response) => {
                        if (!response.error) {
                            toast("Sign up is successful!")
                          navigate("/shop");
                        } else {
                          setLoginError({
                            errorMessage: response.error,
                        });
                        }
                      });
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;

                      setLoginError({
                        errorCode: errorCode,
                        errorMessage: errorMessage,
                      });
                    })
                    .finally(() => {
                      setSignUpLoading(false);
                    });
                }
              }}
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
          {logInError ? (
            <MessageBox type="error" message={logInError.errorMessage} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
