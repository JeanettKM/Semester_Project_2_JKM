import { addBootstrapCardStyling } from "./cardStyling.mjs";
import { updateNavbar } from "./navbar.mjs";

const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";

let allListings = [];
let thisPage = 1;
const amountOfListings = 8;

const auctionListings = document.getElementById("auctionListings");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchText = document.getElementById("searchText");
const searchBtn = document.getElementById("searchBtn");
const newAuctionForm = document.getElementById("newAuctionForm");

function displayLoading() {
  auctionListings.innerHTML = "Loading...";
}

async function fetchListings() {
  try {
    const sortByField = "title";
    const sortOrder = "asc";
    const query = `?sort=${sortByField}&sortOrder=${sortOrder}`;
    const response = await fetch(`${API_BASE_URL}/listings${query}`);

    if (response.ok) {
      const content = await response.json();
      return content;
    } else {
      throw new Error("Something went wrong while fetching listings");
    }
  } catch (error) {
    throw error;
  }
}

function showMoreListings(button = null) {
  const listingStart = (thisPage - 1) * amountOfListings;
  let listingEnd = listingStart + amountOfListings;

  const listingsToShow = allListings.slice(listingStart, listingEnd);
  addBootstrapCardStyling(auctionListings, listingsToShow, true);

  if (listingEnd < allListings.length) {
    thisPage++;
  } else if (button) {
    button.style.display = "none";
  }
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => showMoreListings(loadMoreBtn));
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const content = await fetchListings();
    allListings = content;
    showMoreListings(loadMoreBtn);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
});

function searchListings(query, listings) {
  thisPage = 1;

  // Apply Search
  const searchResults = listings.filter((listing) => {
    const listingTitle = listing.title.toLowerCase();
    const listingTags = listing.tags.join(", ").toLowerCase();
    query = query.toLowerCase();

    return listingTitle.includes(query) || listingTags.includes(query);
  });

  addBootstrapCardStyling(
    auctionListings,
    searchResults.slice(0, amountOfListings)
  );
}

if (searchBtn) {
  searchBtn.addEventListener("click", async () => {
    const query = searchText.value;

    try {
      displayLoading();
      const content = await fetchListings();
      searchListings(query, content);
    } catch (error) {
      console.error("Error fetching or filtering listings:", error);
    }
  });
}

// Check if the user is authenticated and hide/show the form accordingly
if (newAuctionForm) {
  const authenticationToken = localStorage.getItem("accessToken");
  if (authenticationToken) {
    // User is authenticated, show the form
    newAuctionForm.style.display = "block";

    // Function to display or hide the error message for the image URL
    function displayError(fieldName, message) {
      const errorContainer = document.getElementById(`${fieldName}Error`);
      errorContainer.textContent = message;

      // show error message if error occurs
      if (message) {
        errorContainer.style.display = "block";
      } else {
        errorContainer.style.display = "none";
      }
    }

    newAuctionForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const auctionTitle = document.getElementById("auctionTitle").value;
      const auctionDescription =
        document.getElementById("auctionDescription").value;
      const auctionImageURL = document.getElementById("auctionImageURL").value;
      const auctionDeadline = document.getElementById("auctionDeadline").value;

      // Reset previous error messages
      displayError("auctionTitle", "");
      displayError("auctionDescription", "");
      displayError("auctionImageURL", "");
      displayError("auctionDeadline", "");

      try {
        // check title
        if (!auctionTitle.trim()) {
          throw new Error("Title is required.");
        }

        // check description
        if (!auctionDescription.trim()) {
          throw new Error("Description is required.");
        }

        // check image URL
        if (!auctionImageURL.trim()) {
          throw new Error("Image URL is required.");
        }

        // check image URL format
        if (!isValidUrl(auctionImageURL)) {
          throw new Error("Please enter a valid image URL.");
        }

        // check deadline
        const currentDateTime = new Date();
        const selectedDateTime = new Date(auctionDeadline);
        if (selectedDateTime <= currentDateTime) {
          throw new Error("Deadline must be ahead of the current time.");
        }

        await newListing(
          auctionTitle,
          auctionDescription,
          [],
          [auctionImageURL],
          new Date(auctionDeadline)
        );

        // Update local data after successful creation
        const updatedListings = await fetchListings();
        allListings = updatedListings;
        showMoreListings(loadMoreBtn);

        console.log("Auction created successfully!");
      } catch (error) {
        // Display error messages
        if (error.message.includes("Title")) {
          displayError("auctionTitle", error.message);
        } else if (error.message.includes("Description")) {
          displayError("auctionDescription", error.message);
        } else if (error.message.includes("Image")) {
          displayError("auctionImageURL", error.message);
        } else if (error.message.includes("Deadline")) {
          displayError("auctionDeadline", error.message);
        }

        console.error("Error creating auction:", error.message);
      }
    });
  } else {
    // User is not authenticated, hide the form
    newAuctionForm.style.display = "none";
  }
}

export async function newListing(title, description, tags, media, endsAt) {
  try {
    const authenticationToken = localStorage.getItem("accessToken");
    const requestBody = {
      title,
      description,
      tags,
      endsAt: endsAt.toISOString(),
    };

    // Check if the media array is a valid URL
    if (media && Array.isArray(media) && media.length > 0) {
      const isValidUrls = media.every((url) => isValidUrl(url));

      if (isValidUrls) {
        requestBody.media = media;
      } else {
        throw new Error("Invalid URL");
      }
    }

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authenticationToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const content = await response.json();
      console.log("Listing created!", content);
    } else {
      const errorContent = await response.json();
      console.error("Error creating listing:", errorContent);
      throw new Error(
        `Cant create new Listing. ${JSON.stringify(errorContent)}`
      );
    }
  } catch (error) {
    throw error;
  }
}

function isValidUrl(url) {
  try {
    if (url && url.trim() !== "") {
      new URL(url);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
