import React, { useState, useEffect } from "react";
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
  const linkedUserEmail = query.get("linkedUserEmail");

  const navigate = useNavigate();

  useEffect(() => {
    setLoginError(null);
  }, [formData.email, formData.password]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [field]: "" });
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      if (from !== "order-tracking") {
        navigate("/shop");
        return;
      }

      const { error } = await handleLoginWithState(state, user);
      console.log("error:", error);
      if (error) {
        throw new Error(error);
      } else {
        toast("You have successfully logged in. Happy shopping!", {
          type: "success",
        });
        navigate(`/orders/${orderId}`);
      }
    } catch (error) {
      signOut(auth).finally(() => {
        setLoginError({
          errorMessage: error.message,
        });
      });
    } finally {
      setLoginLoading(false);
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

  const DisplayPromptFromState = () => {
    const style = " text-sm text-slate-700 font-semibold";

    if (state === "authenticated-order-not-in-user-linked-user-not-matched") {
      return (
        <p className={style}>
          {`Please log in to the account associated with this order: ${linkedUserEmail}`}
        </p>
      );
    } else if (state === "not-authenticated-has-linked-user") {
      return (
        <p className={style}>
          {`Please log in to the account associated with this order: ${linkedUserEmail}`}
        </p>
      );
    } else if (
      state === "not-authenticated-no-linked-user" ||
      state === "authenticated-no-linked-user"
    ) {
      return (
        <p className={style}>
          {`Log in to connect order ${orderId || ""} to your existing account.`}
        </p>
      );
    } else if (
      state === "authenticated-failed-no-order-token" ||
      state === "authenticated-order-token-invalid"
    ) {
      return <p className={style}>{`Login to view your order.`}</p>;
    } else {
      return null;
    }
  };

  return (
    <div className="w-full h-full justify-center items-center flex">
      <div className="w-96 flex flex-col text-center">
        <p className="text-3xl font-semibold mb-3">Welcome Back!</p>
        <div className="">
          <DisplayPromptFromState />
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
          <MessageBox type="error" message={logInError.errorMessage} />
        )}
      </div>
    </div>
  );
}
