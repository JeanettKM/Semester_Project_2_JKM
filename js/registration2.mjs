// registration2.mjs

const API_BASE_URL = "https://api.noroff.dev/api/v1/auction"; // API base URL

document
  .getElementById("registrationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const registrationData = {
        name: username,
        email: email,
        password: password,
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        const responseData = await response.json();
        // Registration successful, you may handle the response data as needed
        console.log("Registration successful:", responseData);

        // Redirect to the profile page
        window.location.href = "profile2.html";
      } else {
        // Registration failed, handle the error
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        document.getElementById("emailRegistrationError").textContent =
          errorData.message || "Registration failed. Please try again.";
      }
    } catch (error) {
      console.error("Error during registration:", error);
      document.getElementById("emailRegistrationError").textContent =
        "An error occurred during registration. Please try again.";
    }
  });
