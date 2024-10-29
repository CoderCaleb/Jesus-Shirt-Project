import React, { useState, useEffect, useContext, useRef } from "react";
import InputField from "./InputField";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { LuLoader2 } from "react-icons/lu";
import MessageBox from "./MessageBox";
import GoogleButton from "./GoogleButton";
import { toast } from "react-toastify";
import useQuery from "../hooks/useQuery";
import {
  handleFieldChange,
  getFriendlyErrorMessage,
  sendVerificationEmail,
} from "../utils/helpers";
import DisplayPromptFromState from "./DisplayPromptFromState";
import { StateSharingContext } from "../contexts";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [logInError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const query = useQuery();
  const from = query.get("from");
  const state = query.get("state");
  const orderId = query.get("orderId");
  const orderToken = query.get("orderToken");
  const email = query.get("email");
  const linkedUserEmail = query.get("linkedUserEmail");

  const latestLoginEmail = useRef(null)

  const { setSendVerificationEmailModal } =
  useContext(StateSharingContext); 

  const navigate = useNavigate();

  useEffect(() => {
    setLoginError(null);
  }, [formData.email, formData.password]);

  const handleChange = handleFieldChange(setFormData, setFormErrors);

  const handleVerifyEmail = async (email, navigatedFrom) => {
    setSendVerificationEmailModal({
      state: true,
      email: latestLoginEmail.current,
    })
  };

  const verifyAndNavigate = async (user, from) => {
    const { error } = await handleVerification(formData.email, user);
    console.log("error:", error);
    if (error) {
      throw new Error(error);
    } else {
      navigateToPage(from);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    latestLoginEmail.current = formData.email
    const auth = getAuth();

    try {
      if (from === "sign-up" || from === "change-email") {
        if (email !== formData.email) {
          throw new Error(`Please sign in to ${email} to continue`);
        }
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        setLoginError({
          errorMessage: "Email is not verified.",
          clickableTextJSX: (
            <p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => handleVerifyEmail(formData.email, "login")}
              >
                Click here
              </span>{" "}
              to verify
            </p>
          ),
        });
        return;
      }

      if (from === "order-tracking") {
        const { error } = await handleLoginWithState(state, user);
        console.log("error:", error);
        if (error) {
          throw new Error(error);
        } else {
          navigateToPage(from, orderId);
        }
      } else if (from === "sign-up") {
        await verifyAndNavigate(user, from);
      } else if (from === "change-email") {
        await verifyAndNavigate(user, from);
      } else if (from === "login") {
        await verifyAndNavigate(user, from);
      } else {
        navigateToPage(from);
      }
    } catch (error) {
      signOut(auth).finally(() => {
        let errorMessage = getFriendlyErrorMessage(error.code);
        errorMessage = errorMessage ? errorMessage : error.message;
        console.log(error);
        setLoginError({ errorMessage });
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const navigateToPage = (from, orderId) => {
    if (from === "order-tracking") {
      navigate(`/orders/${orderId}`);
    } else if (from === "sign-up") {
      navigate("/shop");
    } else if (from === "change-email") {
      navigate("/profile");
    } else if (from === "login") {
      navigate("/shop");
    } else {
      navigate("/shop");
    }
    toast("You have successfully logged in. Happy shopping!", {
      type: "success",
    });
  };

  //handle errors by returning errors object
  const handleVerification = async (email, user) => {
    try {
      if (!user && !email) {
        throw new Error("An unexpected error occurred.");
      }
      const idToken = await user.getIdToken();

      // Make the POST request to your endpoint
      const response = await fetch(
        "http://127.0.0.1:4242/login-from-verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            uid: user.uid,
          }),
        }
      );

      // Check if the response is ok and parse the JSON
      const data = await response.json();

      // Handle the response data
      if (!response.ok) {
        const errorMessage = data.error
        throw new Error(errorMessage);
      } else {
        return { data: "success" };
      }
    } catch (error) {
      return { error: `${error.message}` };
    }
  };

  async function handleLoginWithState(state, user) {
    if (!user) {
      return { error: "User not provided" };
    }

    try {
      const userToken = await user.getIdToken(true);
      const url = "http://127.0.0.1:4242/login-with-state";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
          "Order-Token": orderToken,
        },
        body: JSON.stringify({
          uid: user.uid,
          orderNumber: orderId,
          state,
        }),
      };

      const response = await fetch(url, options);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`${data.error}`);
      }

      return { data };
    } catch (error) {
      console.log(error);
      return { error: `${error.message}` };
    }
  }

  return (
    <div className="w-full h-full justify-center items-center flex">
      <div className="w-96 flex flex-col text-center">
        <p className="text-3xl font-semibold mb-3">Welcome Back!</p>
        <div className="">
          {from === "order-tracking" ? (
            <DisplayPromptFromState
              state={state}
              linkedUserEmail={linkedUserEmail}
              orderId={orderId}
            />
          ) : from === "sign-up" || from === "change-email" ? (
            <p className=" text-sm text-slate-700 font-semibold">{`Email verification successful. Please sign in to ${email} to proceed`}</p>
          ) : (
            <></>
          )}
        </div>
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
          <InputField
            data={formData.password}
            setData={(value) => handleChange("password", value)}
            error={formErrors.password}
            label={"Password"}
            placeholder={"Create a secure password"}
            type={"password"}
          />
        </div>
        <div className="pt-5">
          <button
            className="border-2 w-full h-12 font-semibold rounded-[10px] border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={handleLogin}
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
        <p className="mt-5 text-sm text-slate-800 font-semibold">
          Don't have an account yet?{" "}
          <Link
            to={
              from === "order-tracking" &&
              (state === "not-authenticated-no-linked-user" ||
                state === "authenticated-no-linked-user")
                ? `/signup?from=order-tracking&state=${state}&orderId=${orderId}&orderToken=${orderToken}`
                : "/signup"
            }
          >
            <span className="cursor-pointer text-blue-600 mt-5">
              Sign up now
            </span>
          </Link>
        </p>
        {logInError && (
          <MessageBox
            type="error"
            message={logInError.errorMessage}
            clickableText={logInError.clickableTextJSX}
          />
        )}
      </div>
    </div>
  );
}
