import { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext used outside AuthProvider");

  return context;
}

const initialState = {
  isAuthenticated: false,
  isLoggedIn: false,
  isSignedUp: false,
  name: localStorage.getItem("name") || "",
  email: localStorage.getItem("email") || "",
  password: "",
  token: localStorage.getItem("token") || "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SHOW_LOGIN_SIGNUP_MODAL":
      return { ...state, isLoggedIn: true };

    case "login/success":
      const {
        token: tokenLogin,
        name: nameLogin,
        email: emailLogin,
      } = action.payload;
      return {
        ...state,
        email: emailLogin,
        password: "",
        token: tokenLogin,
        name: nameLogin,
        isLoggedIn: false,
        isAuthenticated: true,
      };

    case "signup/success":
      const {
        token: tokenSignup,
        name: nameSignup,
        email: emailSignup,
      } = action.payload;
      return {
        ...state,
        token: tokenSignup,
        email: emailSignup,
        name: nameSignup,
        isSignedUp: false,
        isLoggedIn: false,
        isAuthenticated: true,
      };

    case "modal/closed":
      return { ...state, isLoggedIn: false, isSignedUp: false };

    case "modal/opened":
      return {
        ...state,
        isLoggedIn: !state.isLoggedIn,
        isSignedUp: !state.isSignedUp,
      };

    case "logout":
      return { ...state, token: "", name: "", isAuthenticated: false };

    default:
      throw new Error("Unkown action");
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { name, email, token, isLoggedIn, isAuthenticated, isSignedUp } = state;

  // HANDLE CLOSE MODAL
  function handleCloseModal() {
    dispatch({ type: "modal/closed" });
  }

  // HANDLE OPEN MODAL

  function handleOpenModal() {
    dispatch({ type: "modal/opened" });
  }

  // HANDLE SHOW LOGIN/SIGNUP MODAL

  function showLoginSignupModal() {
    dispatch({ type: "SHOW_LOGIN_SIGNUP_MODAL" });
  }

  // HANDLE LOGOUT

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("flightBookingIDs");
    dispatch({ type: "logout" });
    toast.info("You have successfully logged out");
  }

  /// LOGIN USER

  async function fetchLoginDetails(loginPayload) {
    // console.log(loginPayload);
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            projectID: import.meta.env.VITE_APP_PROJECT_ID,
          },
          body: JSON.stringify({ ...loginPayload, appType: "bookingportals" }),
        }
      );

      // console.log(response);
      if (!response.ok) {
        throw new Error("Invalid email or password"); // ERROR MESSAGE FOR UNREGISTERED USER
      }

      const responseData = await response.json();

      // console.log(responseData);

      if (responseData.status === "success") {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userDetails", JSON.stringify(responseData?.data));
        localStorage.setItem("name", responseData?.data?.user?.name);
        localStorage.setItem("email", responseData?.data?.user?.email);

        dispatch({
          type: "login/success",
          payload: {
            token: responseData.token,
            name: responseData?.data?.user?.name,
            email: responseData?.data?.user?.email,
          },
        });

        return "You have logged in successfully "; // SUCCESS MEESSAGE
      }
    } catch (error) {
      throw error;
    }
  }

  /// SIGNUP USER

  async function fetchSignupDetails(signupPayload) {
    // console.log(signupPayload);
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            projectID: import.meta.env.VITE_APP_PROJECT_ID,
          },
          body: JSON.stringify({ ...signupPayload, appType: "bookingportals" }),
        }
      );

      const responseData = await response.json();

      if (responseData.status === "success") {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem(
          "userDetails",
          JSON.stringify(responseData?.data?.user)
        );
        localStorage.setItem("name", responseData?.data?.user?.name);
        localStorage.setItem("email", responseData?.data?.user?.email);
        dispatch({
          type: "signup/success",
          payload: {
            token: responseData.token,
            name: responseData?.data?.user?.name,
            email: responseData?.data?.user?.email,
          },
        });

        return "You have registered successfully"; // SUCCESS
      }

      if (responseData.status === "fail") {
        throw new Error("Already have and account, login please !");
      }
    } catch (error) {
      throw error; // DIRECTLY RETURN AN ERROR FROM HERE
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        name,
        email,
        isLoggedIn,
        isSignedUp,
        isAuthenticated,
        handleCloseModal,
        handleOpenModal,
        handleLogout,
        fetchLoginDetails,
        fetchSignupDetails,
        showLoginSignupModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
