import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState("EMAIL");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const sendOTP = () => {
    if (name && email) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(generatedOtp);
      alert("OTP Sent: " + generatedOtp); // simulate OTP
      setStep("OTP");
    } else {
      alert("Please enter Name and Email");
    }
  };

  const verifyOTP = () => {
    if (enteredOtp === otp) {
      setStep("FINAL");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signup complete:
    Name: ${name}
    Email: ${email}
    Mobile: ${mobile}`);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(step === "EMAIL" || step === "OTP" || step === "FINAL") && (
            <>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-orange-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/*Send OTP button */}
          {step === "EMAIL" && (
            <div>
              <button
                type="button"
                onClick={sendOTP}
                className="bg-[#f68402] text-white py-2 px-4 rounded-xl hover:bg-[#e37200]"
              >
                Send OTP
              </button>
              <div className="py-2 text-lg flex">
                <p>Already Signup ? , </p>
                <NavLink to='/login' className=" mx-2 text-blue-400">Login</NavLink>
              </div>
            </div>
          )}

          {/* Enter OTP functionality*/}
          {step === "OTP" && (
            <>
              <div>
                <label className="block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-orange-500"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={verifyOTP}
                className=" bg-[#f68402] text-white py-2 px-4 rounded-xl hover:bg-[#e37200]"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Password & Mobile after OTP */}
          {step === "FINAL" && (
            <>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-orange-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Mobile Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-orange-500"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className=" bg-[#f68402] text-white py-2 px-4 rounded-xl hover:bg-[#e37200]"
              >
                Complete Signup
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
