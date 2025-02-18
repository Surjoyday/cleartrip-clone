import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Modal } from "@mui/material";

import { VscClose } from "react-icons/vsc";

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { fetchSignupDetails, isSignedUp, handleCloseModal, handleOpenModal } =
    useAuth();

  function handleSubmit(e) {
    e.preventDefault();

    if (name && regex.test(email) && passRegex.test(password)) {
      // fetchSignupDetails({ name, email, password }).then(
      //   ({ signupSuccess, message }) => {
      //     if (signupSuccess) {
      //       toast.success(message, { theme: "colored" });
      //     } else {
      //       toast.error(message, { theme: "colored" });
      //     }
      //     setEmail("");
      //     setName("");
      //     setPassword("");
      //   }
      // );

      (async () => {
        try {
          const message = await fetchSignupDetails({ name, email, password });
          toast.success(message, { theme: "colored" });
        } catch (error) {
          toast.error(error.message, { theme: "colored" });
        }
      })();
    } else if (email && !regex.test(email)) {
      toast.error("Email is invalid !", { theme: "colored" });
      setEmail("");
    } else if (password && !passRegex.test(password)) {
      toast.error(
        "Your password needs to be at least 8 characters with letters, numbers, and symbols",
        { theme: "colored" }
      );
      setPassword("");
    } else {
      toast.error("Please fill out all required fields", { theme: "colored" });
      setEmail("");
      setName("");
      setPassword("");
    }
  }
  return (
    <div>
      <Modal
        open={isSignedUp}
        onClose={() => {
          handleCloseModal();
        }}
        aria-labelledby="signup-modal"
        aria-describedby="modal-signup-user"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-none flex justify-between gap-4 font-sans rounded-lg outline-none">
          <div className=" bg-[#ffeee8] rounded-l-lg py-20">
            <img
              src="https://fastui.cltpstatic.com/image/upload/f_auto,q_auto,w_410,h_337,dpr_2/offermgmt/images/slider2.png"
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
              <h2 className="text-xl font-medium text-center mb-3.5">
                Sign up
              </h2>
              <div className="flex flex-col">
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <input
                    className="border p-2 rounded-md mb-3 text-sm"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="w-full bg-[#1A1A1A] text-white rounded-md text-lg mt-7"
                    value="Sign up"
                    onClick={handleSubmit}
                  >
                    Sign up
                  </button>
                </form>
                <div className="text-sm flex whitespace-nowrap gap-1 mt-3 items-center">
                  <p>Already have an account ? </p>
                  <button onClick={handleOpenModal} className="text-[#3366CC]">
                    {" "}
                    Login{" "}
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
