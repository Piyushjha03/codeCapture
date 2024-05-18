import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api";
import { RingLoader } from "react-spinners";

const AuthHandler = () => {
  const nav = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    csrf: "",
    LEETCODE_SESSION: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (loginDetails.csrf !== "" && loginDetails.LEETCODE_SESSION !== "") {
        return await login(loginDetails);
      }
    },
    onError: (error) => {
      console.log(error);
      const msg = error?.response?.data || "Something went wrong!";
      notify(msg);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.userStatus?.username !== undefined) {
        if (data.data.userStatus.username !== "") {
          console.log(data);
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              username: `${data.data.userStatus.username}`,
              realname: `${data.data.userStatus.realName}`,
              avatar: `${data.data.userStatus.avatar}`,
            })
          );
          nav("/feed");
        } else {
          localStorage.removeItem("userInfo");
          mutation.reset();
        }
      }
    },
  });

  const extractCookiesFromURLBar = () => {
    const url = window.location.href;
    const cookies = {};

    // Extract the query parameters
    const queryString = url.split("?")[1];
    if (queryString) {
      const queryParams = new URLSearchParams(queryString);

      // Get the 'cookie' parameter value
      const cookieParam = queryParams.get("cookie");
      // Split the cookie string by ';' and parse each part
      if (cookieParam) {
        const cookieParts = cookieParam.split(";");
        cookieParts.forEach((part) => {
          const [key, value] = part.trim().split("=");
          cookies[key] = value;
        });
      }
    }

    return cookies;
  };

  useEffect(() => {
    try {
      const extractedCookies = extractCookiesFromURLBar();

      setLoginDetails({
        csrf: extractedCookies.csrftoken,
        LEETCODE_SESSION: extractedCookies.LEETCODE_SESSION,
      });
    } catch (error) {
      nav("/login");
    }
  }, []);

  useEffect(() => {
    if (loginDetails.csrf && loginDetails.LEETCODE_SESSION) {
      mutation.mutate();
    }
  }, [loginDetails]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <RingLoader color="#FD7954" size={200} />
    </div>
  );
};

export default AuthHandler;
