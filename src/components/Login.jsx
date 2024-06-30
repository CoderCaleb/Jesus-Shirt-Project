import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { LuLoader2 } from "react-icons/lu";
import MessageBox from "./MessageBox";
import GoogleButton from "./GoogleButton";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [logInError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
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
      toast("You have successfully logged in. Happy shopping!", {
        type: "success",
      });
      navigate("/shop");
    } catch (error) {
      setLoginError({
        errorMessage: error.message,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    toast("You have successfully logged in. Happy shopping!", {
      type: "success",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      navigate("/shop");
    } catch (error) {
      setLoginError({
        errorMessage: error.message,
      });
    }
  };

  return (
    <div className="w-full h-full justify-center items-center flex">
      <div className="w-96 flex flex-col text-center">
        <p className="text-3xl font-semibold mb-3">Welcome Back!</p>
        <p className="mb-5 text-sm text-slate-700 font-semibold">
          `Login to calebtanxy@gmail.com to view your order {" "}`
        </p>
        <GoogleButton onClick={handleGoogleLogin} />
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
          <Link to={"/signup"}>
            <span className="cursor-pointer text-blue-600 mt-5">Sign up now</span>
          </Link>
        </p>
        {logInError && (
          <MessageBox
            type="error"
            message={
              "Login unsuccessful. Please check if your email or password is correct."
            }
          />
        )}
      </div>
    </div>
  );
}
