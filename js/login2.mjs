document.addEventListener("DOMContentLoaded", () => {
  const userLoginForm = document.getElementById("userLoginForm");

  userLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await userLoginAction(username, email, password);
    } catch (error) {
      console.error("Login error", error);

      const displayError = document.getElementById("displayError");
      displayError.textContent =
        "Incorrect email or password. Please try again.";
    }
  });
});

export async function userLoginAction(username, email, password) {
  const userInfoRequest = { name: username, email, password };

  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/auction/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfoRequest),
      }
    );

    if (response.ok) {
      const content = await response.json();

      localStorage.setItem("accessToken", content.accessToken);
      localStorage.setItem("userEmail", content.email);
      localStorage.setItem("userName", content.name);

      window.location.href = "profile2.html";
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    throw error;
  }
}
