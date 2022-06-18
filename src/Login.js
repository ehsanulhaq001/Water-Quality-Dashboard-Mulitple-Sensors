import React from "react";

import "./Login.css";
import loginLogo from "./loginLogo.svg";

export default function Login() {
  return (
    <div className="loginContainer dark">
      <h1>WATER QUALITY MONITORING SYSTEM</h1>
      <div className="loginHolder">
        <div>
          <a href="https://e-ota.auth.us-west-2.amazoncognito.com/login?client_id=3vm3g2no0h2no8epg9t4rd2bqe&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://dev.d1yqbcg65eu4ox.amplifyapp.com/">
            <img src={loginLogo} alt="Login Logo" />
          </a>
        </div>
      </div>
    </div>
  );
}
