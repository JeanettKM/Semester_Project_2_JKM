const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";

document
  .getElementById("registrationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validation for email
    const emailRegex = /^[\w-]+(\.[\w-]+)*@(noroff\.no|stud\.noroff\.no)$/;
    const isValidEmail = emailRegex.test(email);

    // Validation for password
    const isValidPassword = password.length >= 8;

    try {
      const errorContainer = document.getElementById(
        "passwordRegistrationError"
      );
      errorContainer.classList.add("d-none"); // Hide the error message

      if (!isValidEmail) {
        // Email validation failed
        errorContainer.textContent =
          "Please use a valid @noroff.no or @stud.noroff.no email address.";
        errorContainer.classList.remove("d-none");
        return;
      }

      if (!isValidPassword) {
        // Password validation failed
        errorContainer.textContent =
          "Password must be at least 8 characters long.";
        errorContainer.classList.remove("d-none");
        return;
      }

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
        const content = await response.json();
        // Registration successful
        console.log("Registration successful:", content);

        // Store user data in localStorage
        localStorage.setItem("accessToken", content.accessToken);
        localStorage.setItem("userName", content.name);

        // Redirect to the profile page
        window.location.href = "profile2.html";
      } else {
        // Registration failed
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        errorContainer.textContent =
          errorData.message || "Registration failed. Please try again.";
        errorContainer.classList.remove("d-none");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      errorContainer.textContent =
        "An error occurred during registration. Please try again.";
      errorContainer.classList.remove("d-none");
    }
  });
