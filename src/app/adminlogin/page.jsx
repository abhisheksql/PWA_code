"use client";
import { useState } from "react";
import axios from "axios";
import "../../../public/style/onboarding.css";
import Image from "next/image";
import backgroundImage from "../../../public/images/login_bg.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import loginlogo from '../../../public/images/white_logo.svg';
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

const API_BASE_URL = process.env.NEXT_PUBLIC_LEAP_API_URL
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (event) => {
    setIsLoader(true);
    event.preventDefault();

    const requestData = {
      username: email,
      password: password,
      onboard_platform:true
    };

    try {
      const response = await axios.post(
        API_BASE_URL + "onboarding/login/",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 200) {
        // Handle success: redirect, store tokens, etc.
        const { access, refresh } = response.data;
      // Store tokens in localStorage (or sessionStorage if you prefer)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("admin", "admin");
      router.push('/onboarding');
      } else {
        console.error("Login failed:", response.data);
        setErrorMessage("Invalid credentials");
        setIsLoader(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Invalid credentials");
      setIsLoader(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background-container">
        <Image
          src={backgroundImage}
          alt="Background"
          className="background-image"
        />
      </div>
      <div className="content-container">
        <div className="logo-container">
          <Image src={loginlogo} alt="AcadAlly Logo" className="logo" />
        </div>
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login to your Account</h2>
            <div className="login-group" style={{ marginBottom: "30px" }}>
              <label style={{ color: "#FF8A00" }}>Username*</label>
              <input
                type="text"
                placeholder="Enter UserName"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "95%" }}
              />
            </div>
            <div
              className="login-group password-group"
              style={{ marginBottom: "30px" }}
            >
              <label style={{ color: "#FF8A00" }}>Password*</label>
              <div className="password-wrapper">
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="Enter Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "89%" }}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="password-toggle-icon"
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "60%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#FF8A00",
                    fontSize: "20px",
                  }}
                >
                  {passwordShown ? <FiEye /> : <FiEyeOff />}
                </span>
              </div>
            </div>
            {/* <div className="remember-me">
              <input type="checkbox" />
              Remember Me
            </div> */}
            {errorMessage && <p className="error-message" style={{color:'red', marginBottom:'20px'}}>{errorMessage}</p>}
            <button type="submit" className="login-button">
              Login to Continue
            </button>
          </form>
          
        </div>
      </div>
      {isLoader ? <Loader /> : ''}
    </div>
  );
}
