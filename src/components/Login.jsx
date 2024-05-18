import React, { useState, useContext, useEffect } from "react";
import InputField from "./InputField";
import { Link } from "react-router-dom";
import { StateSharingContext } from "../App";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { LuLoader2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInEmailError, setSignInEmailError] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");
  const [logInError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLoginError(null);
  }, [signInEmail, signInPassword]);
  function handleAddingUser(user){
    if(user){
        fetch("http://127.0.0.1:4242/add-user",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uid:user.uid
            }),
        })
    }
}     
  return (
    <div className="w-full h-full justify-center items-center flex">
      <div className="w-96 flex flex-col text-center">
        <p className="text-3xl font-semibold mb-3">Welcome Back!</p>
        <p className="mb-5 text-sm text-slate-800 font-semibold">
          Don't have an account yet?{" "}
          <Link to={"/signup"}>
            <span className="cursor-pointer text-blue-600">Sign up now</span>
          </Link>
        </p>
        <button
          aria-label="Sign in with Google"
          class="flex font-semibold justify-center items-center bg-white border border-button-border-light rounded-md p-0.5 pr-3"
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
                navigate("/shop");
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
                // ...
              });
          }}
        >
          <div class="flex items-center justify-center bg-white w-9 h-9 rounded-l">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5"
            >
              <title>Sign in with Google</title>
              <desc>Google G Logo</desc>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                class="fill-google-logo-blue"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                class="fill-google-logo-green"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                class="fill-google-logo-yellow"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                class="fill-google-logo-red"
              ></path>
            </svg>
          </div>
          <span class="text-sm text-google-text-gray tracking-wider">
            Sign in with Google
          </span>
        </button>
        <div className=" bg-slate-300 w-full h-lineBreakHeight my-6" />
        <div className="flex flex-col gap-3 text-left">
          <InputField
            data={signInEmail}
            setData={setSignInEmail}
            error={signInEmailError}
            setError={setSignInEmailError}
            label={"Email"}
            placeholder={"larrytan@gmail.com"}
            type="email"
          />
          <InputField
            data={signInPassword}
            setData={setSignInPassword}
            error={signInPasswordError}
            setError={setSignInPasswordError}
            label={"Password"}
            placeholder={"Create a secure password"}
            type={"password"}
          />
        </div>
        <div className="pt-5">
          <button
            className="border-2 w-full h-12 font-semibold rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={() => {
              const auth = getAuth();
              setLoginLoading(true);
              signInWithEmailAndPassword(auth, signInEmail, signInPassword)
                .then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;

                  navigate("/shop");
                  // ...
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  setLoginError({
                    errorCode: errorCode,
                    errorMessage: errorMessage,
                  });
                })
                .finally((res) => {
                  setLoginLoading(false);
                });
            }}
          >
            {!loginLoading ? (
              "Log in"
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
          <MessageBox
            type="error"
            message={
              "Login unsuccessful. Please check if your email or password is correct."
            }
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

function MessageBox({ type, message }) {
  const unsuccessfulStyle =
    "w-full py-3 font-semibold rounded-lg border-l-[6px] text-left text-sm px-5 bg-red-50 border-l-red-700 border-red-300 border-1 justify-center items-center flex gap-3 mt-5";
  const successfulStyle =
    "w-full py-3 font-semibold rounded-lg border-l-[6px] text-left text-sm px-5 bg-green-50 border-l-green-700 border-green-300 border-1 justify-center items-center flex gap-3 mt-5";

  return (
    <div className={type === "success" ? successfulStyle : unsuccessfulStyle}>
      <p>{message}</p>
    </div>
  );
}
