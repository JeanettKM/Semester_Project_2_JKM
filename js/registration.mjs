export function registerNewUser(userInfo) {
  const emailRegistrationError = document.getElementById(
    "emailRegistrationError"
  );

  return fetch("https://api.noroff.dev/api/v1/social/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(
          "Invalid username, email, or password. Please try again."
        );
      }
    })
    .then((content) => {
      console.log("Registration successful", content);

      window.location.href = "profile.html";
    })
    .catch((error) => {
      console.error("Registration error", error);
      emailRegistrationError.textContent = error.message;
    });
}

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userInfo = {
      name: username,
      email: email,
      password: password,
    };

    registerNewUser(userInfo);
  });
