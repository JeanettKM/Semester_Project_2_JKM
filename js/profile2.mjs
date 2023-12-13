const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";
const PROXY_URL = "https://noroffcors.onrender.com/"; // Proxy server URL

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Profile page loaded."); // Log to check if the page loaded

  try {
    const yourAccessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");

    if (!yourAccessToken || !userName) {
      console.error("Access token or user name not found.");
      return;
    }

    console.log("Access token and user name found:", yourAccessToken, userName);

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

      // Display the avatar
      const userAvatarElement = document.getElementById("userAvatar");
      userAvatarElement.src = profileData.avatar || "";

      // Handle the "Change Avatar" functionality
      const avatarInput = document.getElementById("avatarInput");
      const updateAvatarBtn = document.getElementById("updateAvatarBtn");

      updateAvatarBtn.addEventListener("click", async () => {
        const newAvatarURL = avatarInput.value;

        // Check if a URL is provided
        if (newAvatarURL) {
          try {
            // Make a PUT request to update the avatar URL
            const updateAvatarResponse = await fetch(
              `${PROXY_URL}${API_BASE_URL}/profiles/${userName}/media`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${yourAccessToken}`,
                  "Content-Type": "application/json", // Specify JSON content type
                },
                body: JSON.stringify({ avatar: newAvatarURL }), // Send URL in JSON format
              }
            );

            if (updateAvatarResponse.ok) {
              // If the update is successful, update the displayed avatar
              const updatedProfileData = await updateAvatarResponse.json();
              userAvatarElement.src = updatedProfileData.avatar || "";
            } else {
              console.error(
                "Failed to update avatar:",
                await updateAvatarResponse.json()
              );
            }
          } catch (error) {
            console.error("Error updating avatar:", error);
          }
        }
      });
    } else {
      console.error("Failed to fetch user profile:", await response.json());
    }
  } catch (error) {
    console.error("Error during profile initialization:", error);
  }
});
