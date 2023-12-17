import { updateNavbar } from "./navbar.mjs";

const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";
const PROXY_URL = "https://noroffcors.onrender.com/";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Profile page loaded.");

  try {
    const yourAccessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");

    console.log("Access token and user name found:", yourAccessToken, userName);

    // console log to check access token
    console.log("Access token before fetch:", yourAccessToken);

    const response = await fetch(`${API_BASE_URL}/profiles/${userName}`, {
      headers: {
        Authorization: `Bearer ${yourAccessToken}`,
      },
    });

    console.log("Profile API call response:", response);

    if (response.ok) {
      const profileData = await response.json();

      console.log("Profile data:", profileData);

      // Update displayed user information
      document.getElementById("userName").textContent = profileData.name;
      document.getElementById("userEmail").textContent = profileData.email;
      document.getElementById("userCredits").textContent =
        profileData.credits || 0;

      // Display the profile picture
      const userAvatarElement = document.getElementById("userAvatar");
      userAvatarElement.src = profileData.avatar || "";

      // change profile picture functionality
      const avatarInput = document.getElementById("avatarInput");
      const updateAvatarBtn = document.getElementById("updateAvatarBtn");
      const avatarURLError = document.getElementById("avatarURLError");

      updateAvatarBtn.addEventListener("click", async () => {
        const newAvatarURL = avatarInput.value;

        // Remove previous error message
        avatarURLError.textContent = "";
        avatarURLError.style.display = "none";

        // Check if a URL is provided
        if (newAvatarURL) {
          try {
            // Make a PUT request to update the profile picture URL
            const updateAvatarResponse = await fetch(
              `${PROXY_URL}${API_BASE_URL}/profiles/${userName}/media`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${yourAccessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ avatar: newAvatarURL }),
              }
            );

            if (updateAvatarResponse.ok) {
              // update the displayed picture
              const updatedProfileData = await updateAvatarResponse.json();
              userAvatarElement.src = updatedProfileData.avatar || "";
            } else {
              // Display error message
              avatarURLError.textContent = "Must be a publicly accessible URL";
              avatarURLError.style.display = "block";
              console.error(
                "Failed to update profile picture:",
                await updateAvatarResponse.json()
              );
            }
          } catch (error) {
            // Display error message
            avatarURLError.textContent = "Error updating avatar";
            avatarURLError.style.display = "block";
            console.error("Error updating avatar:", error);
          }
        } else {
          // Error message if no input
          avatarURLError.textContent = "Image URL is required";
          avatarURLError.style.display = "block";
        }
      });
    } else {
      console.error("Failed to fetch user profile:", await response.json());
    }
  } catch (error) {
    console.error("Error during profile initialization:", error);
  }
});
