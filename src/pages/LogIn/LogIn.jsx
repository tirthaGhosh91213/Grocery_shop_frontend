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

  // includes a Role dropdown in UI, but routing will use DB role only
  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
    role: "USER",
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
        showPopup(
          `Failed to send OTP: ${result.apiError?.message || "Error"}`,
          "error"
        );
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
        showPopup(
          `OTP verification failed: ${result.apiError?.message || "Error"}`,
          "error"
        );
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
        setRightPanelActive(false); // slide back to Sign In
      } else {
        showPopup(
          `Signup failed: ${result.apiError?.message || "Error"}`,
          "error"
        );
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
        body: JSON.stringify({
          email: signinForm.email,
          password: signinForm.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // roles can be ["ADMIN"] | ["USER"] | "ADMIN"/"USER" | undefined
        const rolesFromDB = result?.data?.roles ?? [];
        const primaryRoleRaw = Array.isArray(rolesFromDB)
          ? (rolesFromDB[0] ?? "USER")
          : rolesFromDB;
        const primaryRole = String(primaryRoleRaw).toUpperCase(); // "ADMIN" | "USER"

        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("roles", JSON.stringify(rolesFromDB));
        localStorage.setItem("primaryRole", primaryRole);

        // Optional UX: warn if user-chosen role doesn't match DB
        const chosen = String(signinForm.role).toUpperCase();
        if (chosen && chosen !== primaryRole) {
          toast.info(
            `Your account role is ${primaryRole}. Continuing with that role.`
          );
        }

        showPopup("Login successful!", "success");

        // ✅ Redirect strictly by DB role
        if (primaryRole === "ADMIN") {
          navigate("/admin/dashborad"); // using your route spelling
        } else {
          navigate("/");
        }
      } else {
        showPopup(
          `Login failed: ${result.apiError?.message || "Error"}`,
          "error"
        );
      }
    } catch (err) {
      showPopup(`Error: ${err.message}`, "error");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Background */}
      <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
        {/* SLIDING CONTAINER (kept exactly, just colors/responsive tweaks) */}
        <div
          className={`relative w-full max-w-4xl min-h-[520px] rounded-xl shadow-2xl overflow-hidden transition-all duration-700 ease-in-out ${
            rightPanelActive ? "right-panel-active" : ""
          }`}
        >
          {/* Sign In Panel */}
          <div
            className={`absolute top-0 left-0 bg-white md:w-1/2 w-full h-full transition-transform duration-700 ease-in-out ${
              rightPanelActive ? "z-10" : "z-20"
            }`}
            style={{
              transform: rightPanelActive ? "translateX(100%)" : "translateX(0)",
            }}
          >
            <form
              onSubmit={handleSignin}
              className="flex flex-col items-center justify-center h-full p-8 gap-4"
            >
              <h1 className="text-3xl font-extrabold text-red-600">Sign In</h1>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signinForm.email}
                onChange={handleSigninChange}
                className="w-full max-w-sm p-3 border border-gray-300 rounded"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signinForm.password}
                onChange={handleSigninChange}
                className="w-full max-w-sm p-3 border border-gray-300 rounded"
                required
              />

              {/* Role dropdown (UI). Routing uses DB role. */}
              <select
                name="role"
                value={signinForm.role}
                onChange={handleSigninChange}
                className="w-full max-w-sm p-3 border border-gray-300 rounded"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                type="submit"
                className="w-full max-w-sm py-3 rounded font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Sign Up Panel */}
          <div
            className={`absolute top-0 right-0 md:w-1/2 w-full bg-white h-full transition-transform duration-700 ease-in-out ${
              rightPanelActive ? "z-20" : "z-10"
            }`}
            style={{
              transform: rightPanelActive
                ? "translateX(0)"
                : "translateX(100%)",
            }}
          >
            <form
              onSubmit={handleSignup}
              className="flex flex-col items-center justify-center h-full p-8 gap-4"
            >
              <h1 className="text-3xl font-extrabold text-orange-600">
                Create Account
              </h1>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={signupForm.name}
                onChange={handleSignupChange}
                className="w-full max-w-sm p-3 border border-gray-300 rounded"
                required
                disabled={otpSent}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupForm.email}
                onChange={handleSignupChange}
                className="w-full max-w-sm p-3 border border-gray-300 rounded"
                required
                disabled={otpSent}
              />

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full max-w-sm py-3 rounded font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition"
                >
                  Send OTP
                </button>
              )}

              {otpSent && !otpVerified && (
                <div className="w-full max-w-sm flex gap-2">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={signupForm.otp}
                    onChange={handleSignupChange}
                    className="flex-1 p-3 border border-gray-300 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 rounded font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition"
                  >
                    Verify
                  </button>
                </div>
              )}

              {otpVerified && (
                <>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    className="w-full max-w-sm p-3 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="mob_no"
                    placeholder="Mobile no."
                    value={signupForm.mob_no}
                    onChange={handleSignupChange}
                    className="w-full max-w-sm p-3 border border-gray-300 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full max-w-sm py-3 rounded font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Overlay Panel (kept, recolored, responsive) */}
          <div
            className="absolute top-0 md:left-1/2 left-0 md:w-1/2 w-full h-full overflow-hidden transition-transform duration-700 ease-in-out z-30"
            style={{
              transform: rightPanelActive
                ? "translateX(-100%)"
                : "translateX(0)",
            }}
          >
            <div className="relative w-full h-full bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center p-8">
              {rightPanelActive ? (
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-extrabold">Welcome Back!</h1>
                  <p>To keep connected, please login with your personal info</p>
                  <button
                    onClick={() => setRightPanelActive(false)}
                    className="border border-white py-2 px-4 rounded hover:bg-white hover:text-red-600 transition"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <h1 className="text-3xl font-extrabold">Hello, Friend!</h1>
                  <p>Enter your details and start your journey with us</p>
                  <button
                    onClick={() => setRightPanelActive(true)}
                    className="border border-white py-2 px-4 rounded hover:bg-white hover:text-orange-600 transition"
                  >
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
