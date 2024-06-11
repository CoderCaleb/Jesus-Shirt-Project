export const safelyParseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };
  
  export const calculatePrices = (products, shippingPrice) => {
    const productPrice = products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    const totalPrice = (parseFloat(productPrice) + parseFloat(shippingPrice)).toFixed(2);
    return {
      productPrice: Number(productPrice),
      totalPrice: Number(totalPrice),
      shippingPrice: Number(shippingPrice)
    };
  };
  
  export const handleGetUserInfo = async (uid, user, userToken, setUserInfo) => {
    try {
      if (user && uid && userToken) {
        const response = await fetch(`http://127.0.0.1:4242/get-user?uid=${user.uid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const result = await response.json();
        setUserInfo(result);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
      setUserInfo(null);
    }
  };
  