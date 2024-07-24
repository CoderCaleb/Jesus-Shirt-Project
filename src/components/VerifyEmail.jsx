import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { StateSharingContext } from "../contexts";
import { applyActionCode, getAuth } from "firebase/auth";

export default function VerifyEmail() {
  const [message, setMessage] = useState("Verifying email...");
  const { user, userToken } = useContext(StateSharingContext);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const navigatedFrom = params.get("navigatedFrom");
    const orderId = params.get("orderId");

    if (!email) {
      setMessage("No email provided");
    }

    if (email && user) {
        handleVerification(email, navigatedFrom, orderId)
    }
  }, [userToken]);

  const handleVerification = async (email, navigatedFrom, orderId) => {
    try {
        // Reload user data to get updated token
        await user.reload();
        
        // Get the updated ID token
        const idToken = await user.getIdToken(true); // `true` forces a token refresh

        // Make the POST request to your endpoint
        const response = await fetch("http://127.0.0.1:4242/verify-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                email,
                uid: user.uid,
            }),
        });

        // Check if the response is ok and parse the JSON
        const data = await response.json();

        // Handle the response data
        if (data.error) {
            setMessage(data.error);
        } else {
            setMessage("Email verification success! Redirecting to shop shortly...");
            setTimeout(() => {
                navigatedFrom !== "order-tracking"
                    ? navigate("/shop")
                    : navigate(`/orders/${orderId}`);
            }, 3000);
        }
    } catch (error) {
        // Handle errors from both fetch and token operations
        setMessage("An error occurred while verifying your email.");
        console.error('Verification error:', error);
    }
};


  return (
    <div className="justify-center px-5 text-center flex items-center w-full h-full">
      <p>{message}</p>
    </div>
  );
}
