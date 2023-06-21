import "./App.css";
import React from "react";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    let userID = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");

    if (!userID || !access_token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <div className="App">
      <Navbar />
      {isLoggedIn ? (
        <UserDashboard setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <SignInSignUp setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;

const Navbar = () => {
  return (
    <div className="navbar_container">
      <h1>Navbar</h1>
      <h2>eduard.hovhannisyan.461@my.csun.edu</h2>
      <h2>12345678</h2>
    </div>
  );
};

const SignInSignUp = ({ setIsLoggedIn }) => {
  const defaultLogin = {
    email: "",
    password: "",
  };

  const defaultsignUp = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  const [login, setLogin] = useState(defaultLogin);
  const [signUp, setSignUp] = useState(defaultsignUp);
  const [signUpMessage, setSignUpMessage] = useState("");
  const [logInMessage, setLogInMessage] = useState("");

  const customOnChangeLogin = (key, e) => {
    setLogInMessage("");
    setLogin({
      ...login,
      [key]: e.target.value,
    });
  };

  const customOnChangeSignUp = (key, e) => {
    setSignUpMessage("");
    setSignUp({
      ...signUp,
      [key]: e.target.value,
    });
  };

  const clearLogin = () => {
    setLogInMessage("");
    setLogin(defaultLogin);
  };

  const clearSignUp = () => {
    setSignUpMessage("");
    setSignUp(defaultsignUp);
  };

  const regEx = /^[a-z]+\.[a-z]+\.[0-9]+@my\.csun\.edu$/g;

  const sign_up_func = () => {
    if (
      !signUp.first_name ||
      !signUp.last_name ||
      !signUp.email ||
      !signUp.password
    ) {
      setSignUpMessage("Please fill out the form properly");
      return;
    }
    let fixedFName = signUp.first_name.trim();
    fixedFName = fixedFName.charAt(0).toUpperCase() + fixedFName.slice(1);
    let fixedLName = signUp.last_name.trim();
    fixedLName = fixedLName.charAt(0).toUpperCase() + fixedLName.slice(1);
    let fixedEmail = signUp.email.trim().toLocaleLowerCase();
    let isCsunEmail = regEx.test(fixedEmail);
    let password = signUp.password;

    if (!isCsunEmail) {
      setSignUpMessage("Email must be by CSUN");
      return;
    }

    if (password.length < 8) {
      setSignUpMessage("Password must no less then 8");
      return;
    }

    fetch("http://localhost:4000/user-register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fname: fixedFName,
        lname: fixedLName,
        email: fixedEmail,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((text) => {
        setSignUpMessage(text);
        setTimeout(() => clearSignUp(), 1000);
      });
  };

  const log_in_func = () => {
    let email = login.email.toLocaleLowerCase().trim();
    let password = login.password;

    if (!email || !password) {
      setLogInMessage("Please fill in blanks");
      return;
    }

    fetch("http://localhost:4000/user-login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user_id && data.access_token) {
          sessionStorage.setItem("user_id", data.user_id);
          sessionStorage.setItem("access_token", data.access_token);
          setIsLoggedIn(true);
        } else {
          setLogInMessage(data);
        }
      });
  };

  return (
    <div className="sign_in_sign_up_container">
      <div className="sign_in_sign_up_container_column">
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => customOnChangeSignUp("first_name", e)}
          value={signUp.first_name}
        />
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => customOnChangeSignUp("last_name", e)}
          value={signUp.last_name}
        />
        <input
          type="text"
          placeholder="CSUN Email"
          onChange={(e) => customOnChangeSignUp("email", e)}
          value={signUp.email}
        />
        <input
          type="password"
          placeholder="Password (Min 8)"
          onChange={(e) => customOnChangeSignUp("password", e)}
          value={signUp.password}
        />
        <button onClick={sign_up_func}>Sign Up</button>
        <button onClick={clearSignUp}>Clear</button>
        {signUpMessage && <p>{signUpMessage}</p>}
      </div>
      <div className="sign_in_sign_up_container_column">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="CSUN Email"
          onChange={(e) => customOnChangeLogin("email", e)}
          value={login.email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => customOnChangeLogin("password", e)}
          value={login.password}
        />
        <button onClick={log_in_func}>Sign In</button>
        <button onClick={clearLogin}>Clear</button>
        {logInMessage && <p>{logInMessage}</p>}
      </div>
    </div>
  );
};

const UserDashboard = ({ setIsLoggedIn }) => {
  const log_out_func = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("access_token");
    setIsLoggedIn(false);
  };

  return (
    <div>
      <button onClick={log_out_func}>Log Out</button>
      <h1>User Dashboard</h1>
    </div>
  );
};
