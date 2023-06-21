import "./App.css";
import React from "react";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Navbar />
      {isLoggedIn ? <UserDashboard /> : <SignInSignUp />}
    </div>
  );
}

export default App;

const Navbar = () => {
  return (
    <div className="navbar_container">
      <h1>Navbar</h1>
    </div>
  );
};

const SignInSignUp = () => {
  const defaultLogin = {
    email: "",
    password: "",
  };

  const [login, setLogin] = useState(defaultLogin);

  const defaultsignUp = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  const [signUp, setSignUp] = useState(defaultsignUp);

  const customOnChangeLogin = (key, e) => {
    setLogin({
      ...login,
      [key]: e.target.value,
    });
  };

  const customOnChangeSignUp = (key, e) => {
    setSignUp({
      ...login,
      [key]: e.target.value,
    });
  };

  console.log(signUp);

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
          placeholder="Password"
          onChange={(e) => customOnChangeSignUp("password", e)}
          value={signUp.password}
        />
        <div>
          <button>Sign Up</button>
          <button>Clear</button>
        </div>
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
        <button>Sign In</button>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
    </div>
  );
};
