import { useState, useEffect } from "react";

const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, options || {});
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        //handle variety of data structures returned by backend
        const returnedDictData =
          result.result || result.data || result.orderErrorInfo;
        if (result.error) {
          setError(result.error);
        } else if (returnedDictData) {
          setData(
            typeof returnedDictData === "string"
              ? JSON.parse(returnedDictData)
              : returnedDictData
          );
        } else {
          setData(result); // In case the result is the data itself
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    console.log("Fetching data");
  }, [url, options]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return { data, loading, error };
};

export default useFetch;
