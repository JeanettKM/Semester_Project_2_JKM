// listing-detail.mjs

import { placeBid, getBidsForListing } from "./bidding.mjs";

const urlSearch = new URLSearchParams(window.location.search);
const listingId = urlSearch.get("id");
const authenticationToken = localStorage.getItem("accessToken");
const listingDetailsContainer = document.getElementById("listingDetails");

function fetchListingDetails() {
  fetch(
    `https://api.noroff.dev/api/v1/auction/listings/${listingId}?_seller=true&_bids=true`,
    {
      headers: {
        Authorization: `Bearer ${authenticationToken}`,
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error(
          "Failed to fetch listing details. Response status:",
          response.status
        );
        throw new Error("Failed to fetch listing details");
      }
    })
    .then((listing) => {
      const listingCard = document.createElement("div");
      listingCard.classList.add("card", "listing-card");
      listingCard.innerHTML = `
            <div class="card-image is-centered m-2">
                <figure class="has-text-centered">
                    ${
                      listing.media && listing.media.length > 0
                        ? `<img class="listing-image" src="${listing.media[0]}" alt="Listing Media">`
                        : ""
                    }
                </figure>
            </div>
            <div class="card-content">
                <h2 class="title mb-6">${listing.title}</h2>
                <p>${listing.description}</p>
                <p class="mt-6">Tags: ${listing.tags.join(", ")}</p>
                <p>Ends At: ${new Date(listing.endsAt).toLocaleString()}</p>
                <section class="m-3">
                    <div>
                        <p>Bids: ${listing._count.bids}</p>
                    </div>
                </section>
            </div>
            `;

      listingDetailsContainer.innerHTML = "";
      listingDetailsContainer.appendChild(listingCard);

      // Add bid placement form
      const placeBidForm = document.createElement("form");
      placeBidForm.innerHTML = `
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Place Bid:</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="number" placeholder="Enter bid amount" id="bidAmount" required />
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-link" type="button" id="placeBidButton">Place Bid</button>
            </div>
          </div>
        </div>
      `;
      listingDetailsContainer.appendChild(placeBidForm);

      // Handle bid placement button click
      const placeBidButton = document.getElementById("placeBidButton");
      placeBidButton.addEventListener("click", () => {
        const bidAmountInput = document.getElementById("bidAmount");
        const bidAmount = parseFloat(bidAmountInput.value);

        if (!isNaN(bidAmount)) {
          placeBid(listingId, bidAmount)
            .then(() => {
              fetchListingDetails();
              bidAmountInput.value = ""; // Clear the input field
            })
            .catch((error) => {
              console.error("Error placing bid:", error);
            });
        } else {
          console.error("Invalid bid amount");
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching listing details:", error);
    });

  // Example usage of getBidsForListing function
  getBidsForListing(listingId)
    .then((bidsData) => {
      // Process and display the bidsData as needed
      console.log("Bids Data:", bidsData);
    })
    .catch((error) => {
      console.error("Error retrieving bids:", error);
    });
}

// Show the listings when the page has loaded
fetchListingDetails();
