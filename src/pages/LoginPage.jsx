import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { VscClose } from "react-icons/vsc";

import { Modal } from "@mui/material";
import { useState } from "react";
import SignupPage from "./SignupPage";

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    isLoggedIn,
    handleCloseModal,
    isSignedUp,
    // handleOpenSignup,
    handleOpenModal,
    fetchLoginDetails,
  } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();

    if (regex.test(email) && passRegex.test(password)) {
      (async () => {
        try {
          const message = await fetchLoginDetails({ email, password });
          setEmail("");
          setPassword("");
          toast.success(message, { theme: "colored" });
        } catch (error) {
          toast.error(error.message, { theme: "colored" });
          setEmail("");
          setPassword("");
        }
      })();
    } else if (email && !regex.test(email)) {
      toast.error("Email is invalid", { theme: "colored" });
    } else if (password && !passRegex.test(password)) {
      toast.error("Password is incorrect", {
        theme: "colored",
      });
    } else {
      toast.error("Fill all the details", { theme: "colored" });
    }
  }

  if (isSignedUp) {
    return <SignupPage />;
  }

  return (
    <div>
      <Modal
        open={isLoggedIn}
        onClose={handleCloseModal}
        aria-labelledby="login-modal"
        aria-describedby="modal-login-user"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-none flex justify-between gap-4 font-sans rounded-lg outline-none">
          <div className=" bg-[#ffeee8] rounded-l-lg py-20">
            <img
              src="https://ucarecdn.com/cd7a929b-e1ce-4a40-b50f-e8acc7ca2619/cleartriploginimg.png"
              alt="login-left-photo"
              className="w-72 max-sm:hidden"
            />
          </div>

          <div className="p-10 flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  handleCloseModal();
                }}
              >
                <VscClose
                  size={22}
                  style={{
                    width: "1.5rem",
                    transition: "color 0.3s",
                    color: "black",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = "#EF4444";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = "black";
                  }}
                />
              </button>
            </div>

            <div className="flex flex-col">
              <h2 className="text-xl font-medium text-center mb-3.5">Login</h2>
              <div className="flex flex-col">
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <input
                    className="border p-2 rounded-md mb-3 text-sm"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    className="border p-2 rounded-md mb-3 text-sm"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="w-full bg-[#1A1A1A] text-white rounded-md text-lg mt-7"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                </form>
                <div className="text-sm flex whitespace-nowrap gap-1 mt-3 items-center">
                  <p>Don't have an account? </p>
                  <button
                    onClick={() => {
                      setEmail("");
                      setPassword("");
                      handleOpenModal();
                    }}
                    className="text-[#3366CC]"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
