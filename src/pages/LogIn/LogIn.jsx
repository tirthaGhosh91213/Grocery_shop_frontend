import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LogIn() {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    mob_no: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const showPopup = (message, type) => {
    type === "success" ? toast.success(message) : toast.error(message);
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleSigninChange = (e) => {
    const { name, value } = e.target;
    setSigninForm({ ...signinForm, [name]: value });
  };

  const handleSendOtp = async () => {
    if (!signupForm.email) {
      showPopup("Please enter your email before requesting OTP", "error");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/v1/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupForm.email }),
      });
      const result = await response.json();
      if (response.ok) {
        showPopup(result.data || "OTP sent successfully", "success");
        setOtpSent(true);
      } else {
        showPopup(`Failed to send OTP: ${result.apiError?.message || "Error"}`, "error");
      }
    } catch (err) {
      showPopup(`Error: ${err.message}`, "error");
    }
  };

  const handleVerifyOtp = async () => {
    if (!signupForm.otp) {
      showPopup("Please enter the OTP", "error");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/v1/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupForm.email,
          otp: signupForm.otp,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        showPopup(result.data || "OTP verified successfully", "success");
        setOtpVerified(true);
      } else {
        showPopup(`OTP verification failed: ${result.apiError?.message || "Error"}`, "error");
      }
    } catch (err) {
      showPopup(`Error: ${err.message}`, "error");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      showPopup("Please verify OTP before signing up.", "error");
      return;
    }
    try {
      const user = {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        mob_no: signupForm.mob_no,
      };
      const response = await fetch("http://localhost:8000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const result = await response.json();
      if (response.ok) {
        showPopup(`Signup successful! ${result.message || ""}`, "success");
        navigate("/signin");
      } else {
        showPopup(`Signup failed: ${result.apiError?.message || "Error"}`, "error");
      }
    } catch (err) {
      showPopup(`Error: ${err.message}`, "error");
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinForm),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("roles", result.data.roles); // ✅ Added line to store roles
        localStorage.setItem("userRole", JSON.stringify(result.data.roles || []));
        showPopup("Login successful!", "success");
        navigate("/");
      } else {
        showPopup(`Login failed: ${result.apiError?.message || "Error"}`, "error");
      }
    } catch (err) {
      showPopup(`Error: ${err.message}`, "error");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-grey min-h-screen flex items-center justify-center bg-gray-200">
        <div className={`relative w-full max-w-4xl min-h-[480px] rounded-lg shadow-xl overflow-hidden transition-all duration-700 ease-in-out ${rightPanelActive ? "right-panel-active" : ""}`}>

          {/* Sign In Panel */}
          <div className={`absolute top-0 bg-gradient-to-r from-slate-400 to-gray-300 left-0 w-1/2 h-full transition-transform duration-700 ease-in-out ${rightPanelActive ? "z-10" : "z-20"}`} style={{ transform: rightPanelActive ? "translateX(100%)" : "translateX(0)" }}>
            <form onSubmit={handleSignin} className="flex flex-col items-center justify-center h-full p-8">
              <h1 className="text-2xl font-bold mb-4">Sign In</h1>
              <input type="email" name="email" placeholder="Email" value={signinForm.email} onChange={handleSigninChange} className="mb-4 p-3 border border-gray-700 text-dark-grey bg-gray-300 rounded w-full" required />
              <input type="password" name="password" placeholder="Password" value={signinForm.password} onChange={handleSigninChange} className="mb-4 p-3 border border-gray-700 text-dark-grey bg-gray-300 rounded w-full" required />
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-800 cursor-pointer text-white py-2 px-8 rounded w-full">Sign In</button>
            </form>
          </div>

          {/* Sign Up Panel */}
          <div className={`absolute top-0 right-0 w-1/2 bg-gradient-to-r from-gray-300 to-slate-400 h-full transition-transform duration-700 ease-in-out ${rightPanelActive ? "z-20" : "z-10"}`} style={{ transform: rightPanelActive ? "translateX(0)" : "translateX(100%)" }}>
            <form onSubmit={handleSignup} className="flex flex-col items-center justify-center h-full p-8">
              <h1 className="text-2xl font-bold mb-4">Create Account</h1>
              <input
                  type="Text"
                  name="name"
                  placeholder="Name"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  className="mb-4 p-3 border border-gray-700 text-dark-grey bg-gray-300 rounded w-full"
                  required
                  disabled={otpSent}
              />
              <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  className="mb-4 p-3 border border-gray-700 text-dark-grey bg-gray-300 rounded w-full"
                  required
                  disabled={otpSent}
              />
              {!otpSent && (
                <button type="button" onClick={handleSendOtp} className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-2 px-4 rounded hover:bg-purple-400 cursor-pointer mb-4">
                  Send OTP
                </button>
              )}
              {otpSent && !otpVerified && (
                <div className="flex space-x-2 mb-4 w-full">
                  <input type="text" name="otp" placeholder="Enter OTP" value={signupForm.otp} onChange={handleSignupChange} className="p-3 border border-gray-700 text-dark-grey bg-gray-300 rounded flex-1" required />
                  <button type="button" onClick={handleVerifyOtp} className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-2 px-4 rounded cursor-pointer">
                    Verify OTP
                  </button>
                </div>
              )}
              {otpVerified && (
                <>
                  <input type="password" name="password" placeholder="Password" value={signupForm.password} onChange={handleSignupChange} className="mb-4 p-3 border border-gray-300 rounded w-full" required />
                  <input type="text" name="mob_no" placeholder="Mobile no." value={signupForm.mob_no} onChange={handleSignupChange} className="mb-4 p-3 border border-gray-300 rounded w-full" required />
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-2 px-4 rounded w-full cursor-pointer">
                    Sign Up
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Overlay Panel */}
          <div className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-30" style={{ transform: rightPanelActive ? "translateX(-100%)" : "translateX(0)" }}>
            <div className="relative w-full h-full bg-gradient-to-r from-blue-600 to-purple-800 text-black flex items-center justify-center p-8">
              {rightPanelActive ? (
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                  <p className="mb-4">To keep connected with us please login with your personal info</p>
                  <button onClick={() => setRightPanelActive(false)} className="border cursor-pointer text-white bg-dark-grey border-white py-2 px-4 rounded hover:bg-white hover:text-black">
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Hello, Friend!</h1>
                  <p className="mb-4">Enter your personal details and start your journey with us</p>
                  <button onClick={() => setRightPanelActive(true)} className="border cursor-pointer border-white bg-dark-grey text-white py-2 px-4 rounded hover:bg-white hover:text-black">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;
