import React from "react";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

import "./auth.css";
import { forgotPassword } from "../../Services/authServices.js";
import logo from "../../assets/react.svg";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  return (
    <div className="auth">
      <div className="auth__container">
        <img src={logo} alt="logo" />
        {!isSuccess && (
          <>
            <div className="auth__form">
              <TextInput
                label="Email"
                value={email}
                onChange={(val) => setEmail(val.toString())}
                placeholder="yourname@email.com"
              />
            </div>
            <div className="auth__action">
              <Button
                label="Send reset link"
                onClick={async () => {
                  const isDone = await forgotPassword(email);
                  setIsSuccess(isDone);
                }}
              />
              <p>
                Remembered suddenly? <Link to="/login">Login</Link>{" "}
              </p>
            </div>
          </>
        )}
        {isSuccess && (
          <>
            <div className="auth__form">
              <p>Reset instruction sent successfully</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
