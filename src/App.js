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
      <h2>BELOW TO BE DELETED LATER</h2>
      <h2>eduard.hovhannisyan.461@my.csun.edu</h2>
      <h2>sabrina.motto.422@my.csun.edu</h2>
      <h2>12345678</h2>
      <p>http://localhost:4000/get-all</p>
      <p>http://localhost:4000/truncate-all - DO NOT GO TO THIS LINK</p>
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

  const defaultTaskInfoToAdd = {
    title: "",
    description: ``,
    date: "",
    category: "",
  };

  const [categoryToAdd, setCategoryToAdd] = useState("");
  const [categories, setCategories] = useState([]);
  const [taskInfoToAdd, setTaskInfoToAdd] = useState(defaultTaskInfoToAdd);
  const [tasks, setTasks] = useState([]);

  const customOnChangeForAddTask = (key, e) => {
    setTaskInfoToAdd({
      ...taskInfoToAdd,
      [key]: e.target.value,
    });
  };

  useEffect(() => {
    getUserCategories();
    getUserTasks();
  }, []);

  const getUserCategories = () => {
    let user_id = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");

    if (!user_id || !access_token) return;

    fetch("http://localhost:4000/get-user-categories", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        access_token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories);
      });
  };

  const getUserTasks = () => {
    let user_id = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");

    if (!user_id || !access_token) return;

    fetch("http://localhost:4000/get-user-tasks", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        access_token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.tasks);
      });
  };

  const addCategory = () => {
    let user_id = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");
    if (!user_id || !access_token) return;

    if (!categoryToAdd) return;

    let fixedCategoryToAdd = categoryToAdd.trim();
    fixedCategoryToAdd =
      fixedCategoryToAdd.charAt(0).toUpperCase() + fixedCategoryToAdd.slice(1);

    fetch("http://localhost:4000/add-user-category", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        access_token,
        category: fixedCategoryToAdd,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories([...categories, data.addedCategory]);
        setCategoryToAdd("");
      });
  };

  const addTask = () => {
    let user_id = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");
    if (!user_id || !access_token) return;

    let fixedTitle = taskInfoToAdd.title.trim();
    let description = taskInfoToAdd.description;
    let date = taskInfoToAdd.date;
    let category = taskInfoToAdd.category;

    if (!fixedTitle || !category) return;

    fetch("http://localhost:4000/add-user-task", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        access_token,
        title: fixedTitle,
        description,
        date,
        category,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data.addedTask]);
        setTaskInfoToAdd(defaultTaskInfoToAdd);
      });
  };

  const [selectedTab, setSelectedTab] = useState("");

  const customeFilter = () => {
    let sortedTasks = tasks.sort((a, b) => a.id - b.id);
    return sortedTasks.filter(
      (task) => task.category === selectedTab && task.completed !== true
    );
  };

  const customeFilterForCompleted = () => {
    let sortedTasks = tasks.sort((a, b) => a.id - b.id);
    return sortedTasks.filter(
      (task) => task.category === selectedTab && task.completed !== false
    );
  };

  const completeTask = (id) => {
    let user_id = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");
    if (!user_id || !access_token) return;

    fetch("http://localhost:4000/complete-user-task", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        access_token,
        id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getUserTasks();
      });
  };

  const unCompleteTask = (id) => {
    let user_id = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");
    if (!user_id || !access_token) return;

    fetch("http://localhost:4000/uncomplete-user-task", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        access_token,
        id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getUserTasks();
      });
  };

  const deleteTask = (id) => {
    let user_id = sessionStorage.getItem("user_id");
    let access_token = sessionStorage.getItem("access_token");
    if (!user_id || !access_token) return;

    fetch("http://localhost:4000/delete-user-task", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        access_token,
        id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getUserTasks();
      });
  };

  return (
    <div className="user_dashboard_container">
      <div className="user_dashboard_navbar">
        <h1>User Dashboard</h1>
        <button onClick={log_out_func}>Log Out</button>
      </div>
      <div className="user_dashboard_tools">
        <div className="user_dashboard_add_category">
          <h2>Add Category</h2>
          <input
            type="text"
            placeholder="Category to add..."
            value={categoryToAdd}
            onChange={(e) => setCategoryToAdd(e.target.value)}
          />
          <button onClick={addCategory}>Add Category</button>
        </div>
        <div className="user_dashboard_add_task">
          <h2>Add Task</h2>
          <input
            type="text"
            placeholder="Title... (required)"
            value={taskInfoToAdd.title}
            onChange={(e) => customOnChangeForAddTask("title", e)}
          />
          <textarea
            id="description"
            name="description"
            rows="5"
            cols="20"
            placeholder="Desctiption..."
            value={taskInfoToAdd.description}
            onChange={(e) => customOnChangeForAddTask("description", e)}
          ></textarea>
          <input
            type="date"
            value={taskInfoToAdd.date}
            onChange={(e) => customOnChangeForAddTask("date", e)}
          />
          <select
            name="categoryToAdd"
            id="categoryToAdd"
            value={taskInfoToAdd.category}
            onChange={(e) => customOnChangeForAddTask("category", e)}
          >
            <option value="">Select Category *</option>

            {categories.map((category) => {
              return (
                <option value={category.category} key={category.id}>
                  {category.category}
                </option>
              );
            })}
          </select>
          <button onClick={addTask}>Add Task</button>
        </div>
      </div>
      {!categories.length ? null : (
        <div className="user_dashboard_tasks_container">
          <div className="user_dashboard_tasks_categories">
            {categories.map((category) => (
              <button
                key={category.id}
                value={category.category}
                onClick={(e) => setSelectedTab(e.target.value)}
              >
                {category.category}
              </button>
            ))}
          </div>
          {!customeFilter().length ? null : (
            <div className="user_dashboard_tasks_view">
              {customeFilter().map((task) => (
                <div key={task.id} className="user_dashboard_tasks_view_task">
                  <div className="user_dashboard_tasks_view_task_left">
                    <h3>{task.title}</h3>
                    <p className="multiline">{task.description}</p>
                    {task.date && (
                      <p>{new Date(task.date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="user_dashboard_tasks_view_task_right">
                    <button
                      value={task.id}
                      onClick={(e) => completeTask(e.target.value)}
                    >
                      Complete
                    </button>
                    <button
                      value={task.id}
                      onClick={(e) => deleteTask(e.target.value)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!customeFilterForCompleted().length ? null : (
            <div className="user_dashboard_tasks_view">
              {customeFilterForCompleted().map((task) => (
                <div
                  key={task.id}
                  className="user_dashboard_tasks_view_task_completed_container"
                >
                  <div className="user_dashboard_tasks_view_task_completed">
                    <h3>{task.title}</h3>
                    <p className="multiline">{task.description}</p>
                    {task.date && (
                      <p>{new Date(task.date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="user_dashboard_tasks_view_task_completed_buttons">
                    <button
                      value={task.id}
                      onClick={(e) => unCompleteTask(e.target.value)}
                    >
                      Uncomplete
                    </button>
                    <button
                      value={task.id}
                      onClick={(e) => deleteTask(e.target.value)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
