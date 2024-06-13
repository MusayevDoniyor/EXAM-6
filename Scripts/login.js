const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const form = document.getElementsByTagName("form")[0];
const loginButton = document.getElementById("loginButton");
const togglePassword = document.getElementById("togglePassword");

let email, password;

init();

function init() {
  checkToken();
  emailInput.oninput = function (event) {
    email = event.target.value.trim();
    checkInputs();
  };

  passwordInput.oninput = function (event) {
    password = event.target.value.trim();
    checkInputs();
  };

  togglePassword.onclick = function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.src =
      type === "password" ? "./Images/show-password.png" : "./Images/hide.png";
  };

  form.onsubmit = async function (event) {
    event.preventDefault();

    try {
      const result = await login();

      if (result.access_token) {
        saveToken(result.access_token);
        checkToken();
      } else {
        console.error("Login failed:", result);
        alert("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
  };
}

function checkInputs() {
  if (email !== "" && password !== "") {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

async function login() {
  const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  } else {
    const result = await response.json();
    if (result.access_token) {
      saveToken(result.access_token);
      checkToken();
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome to the application.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      console.error("Login failed:", result);
      alert("Login failed. Please check your credentials and try again.");
    }
    return result;
  }
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function redirect() {
  window.location.replace("./index.html");
}

function checkToken() {
  const token = localStorage.getItem("token");
  if (token) {
    redirect();
  }
}
