import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthHandler = () => {
  const nav = useNavigate();
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

      if (extractedCookies) {
        for (let eachCookie in extractedCookies) {
          Cookies.set(eachCookie, extractedCookies[eachCookie]);
        }
        Cookies.remove("LEETCODE_SESSION", {
          path: "/",
          domain: ".leetcode.com",
          secure: true,
          sameSite: "Lax",
        });
        Cookies.remove("csrftoken", {
          path: "/",
          domain: "leetcode.com",
          secure: true,
          sameSite: "Lax",
        });
        nav("/feed");
      } else {
        nav("/login");
      }
    } catch (error) {
      nav("/login");
    }
  }, []);

  return (
    <div>
      <h1>Handling Authentication...</h1>
    </div>
  );
};

export default AuthHandler;
