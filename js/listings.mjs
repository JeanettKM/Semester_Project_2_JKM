import { addBulmaCardStyling } from "./cardStyling.mjs";
const API_BASE_URL = "https://api.noroff.dev/api/v1/auction"; // Replace with your actual API base URL

let allListings = [];
let thisPage = 1;
const amountOfListings = 8;

const auctionListings = document.getElementById("auctionListings");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const chosenFilter = document.getElementById("chosenFilter");
const searchBtn = document.getElementById("searchBtn");
const searchText = document.getElementById("searchText");
const newAuctionForm = document.getElementById("newAuctionForm");

function displayLoading() {
  auctionListings.innerHTML = "Loading...";
}

async function fetchListings(filter = {}) {
  try {
    const { _tag, _active } = filter;
    const query = `?_tag=${_tag || ""}&_active=${_active || ""}`;
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
  let listingEnd;
  listingEnd = listingStart + amountOfListings;

  const listingsToShow = allListings.slice(listingStart, listingEnd);
  addBulmaCardStyling(auctionListings, listingsToShow, true);

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

if (chosenFilter) {
  chosenFilter.addEventListener("change", () => {
    const selectedFilter = chosenFilter.value;
    filterListings(selectedFilter);
  });
}

function filterListings(selectedFilter) {
  thisPage = 1;

  if (loadMoreBtn) {
    loadMoreBtn.style.display = "block";
  }

  if (selectedFilter === "all") {
    addBulmaCardStyling(
      auctionListings,
      allListings.slice(0, amountOfListings)
    );
  } else if (selectedFilter === "ending-soon") {
    // Implement logic for filtering ending soon listings
    // You can update the API request accordingly
    // Example: fetchListings({ _active: true, _tag: 'ending-soon' });
  } else if (selectedFilter === "newly-listed") {
    // Implement logic for filtering newly listed listings
    // You can update the API request accordingly
    // Example: fetchListings({ _tag: 'newly-listed' });
  }
}

function searchListings(query, listings) {
  const filterResults = listings.filter((listing) => {
    const listingTitle = listing.title.toLowerCase();
    const listingTags = listing.tags.join(", ").toLowerCase();
    query = query.toLowerCase();

    return listingTitle.includes(query) || listingTags.includes(query);
  });

  thisPage = 1;

  addBulmaCardStyling(
    auctionListings,
    filterResults.slice(0, amountOfListings)
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

if (newAuctionForm) {
  newAuctionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const auctionTitle = document.getElementById("auctionTitle").value;
    const auctionDescription =
      document.getElementById("auctionDescription").value;

    // Calculate endsAt to ensure it's not a past date or more than one year from now
    const currentDate = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);
    const endsAt = oneYearFromNow.toISOString();

    try {
      await newListing(auctionTitle, auctionDescription, [], [], endsAt);

      // Update local data after successful creation
      const updatedListings = await fetchListings();
      allListings = updatedListings;
      showMoreListings(loadMoreBtn);

      console.log("Auction created successfully!");
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  });
}

export async function newListing(title, description, tags, media, endsAt) {
  try {
    const authenticationToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authenticationToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        tags,
        media,
        endsAt,
      }),
    });

    if (response.ok) {
      const content = await response.json();
      console.log("Listing created!", content);
      // Optionally, you can handle the response or redirect the user
    } else {
      const errorContent = await response.json();
      console.error("Error creating listing:", errorContent);
      throw new Error(
        `Could not create the new listing. ${JSON.stringify(errorContent)}`
      );
    }
  } catch (error) {
    throw error;
  }
}
