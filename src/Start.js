import { useEffect, useState } from "react";
// import axios from "axios";
import "./App.css";
import App from "./App.js";
import Login from "./Login.js";

function Start() {
  const [userAuthorized, setUserAuthorized] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken:ehsan") && checkToken()) {
      setUserAuthorized(true);
    } else {
      const hash = window.location.hash;
      if (hash) {
        const acccessToken = window.location.hash.split("=")[1].split("&")[0];
        localStorage.setItem("accessToken:ehsan", acccessToken);
        setUserAuthorized(true);
      }
    }
    if (window.location.hash) {
      window.location.hash = "";
    }
  }, []);

  return !userAuthorized ? (
    <Login />
  ) : (
    <App setUserAuthorized={setUserAuthorized} />
  );
}

export default Start;

const checkToken = () => {
  let expiryTime = getDataFromJWT(
    localStorage.getItem("accessToken:ehsan")
  )?.exp;

  let now = new Date().getTime() / 1000;
  if (now > expiryTime) return false;
  return true;
};

function getDataFromJWT(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");

  return JSON.parse(window.atob(base64));
}
