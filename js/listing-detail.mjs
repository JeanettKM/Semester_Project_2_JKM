import { updateNavbar } from "./navbar.mjs";

import { placeBid, getBidsForListing } from "./bidding.mjs";

const urlSearch = new URLSearchParams(window.location.search);
const listingId = urlSearch.get("id");
const authenticationToken = localStorage.getItem("accessToken");
const listingDetailsContainer = document.getElementById("listingDetails");

/**
 * Ensure listingId is not null before making API calls
 */
if (listingId !== null) {
  fetchListingDetails();
} else {
  console.error("Listing ID is null. Cannot fetch listing details.");
  /**
   * Handle the error or display a message to the user
   */
}

/**
 * Fetch listing details from the API
 */
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
      const now = new Date();
      const endsAt = new Date(listing.endsAt);

      /**
       * Check if the listing has ended
       */
      if (now > endsAt) {
        handleListingEnded();
      } else {
        /**
         * Continue with rendering the listing details
         */

        /**
         * Find the highest bid
         */
        const highestBid = findHighestBid(listing.bids);

        const listingCard = document.createElement("div");
        listingCard.classList.add("card", "listing-card");
        listingCard.innerHTML = `
          <div class="card m-2">
            <div class="card-image text-center">
              <figure class="col-md-7 mx-auto m-3">
                ${
                  listing.media && listing.media.length > 0
                    ? `<img class="img-fluid" src="${listing.media[0]}" alt="Listing Media">`
                    : ""
                }
              </figure>
            </div>
            <div class="card-body">
              <h2 class="card-title mb-4">${listing.title}</h2>
              <p class="card-text">${listing.description}</p>
              <p class="mt-4">Tags: ${listing.tags.join(", ")}</p>
              <p>Ends At: ${new Date(listing.endsAt).toLocaleString()}</p>
              <section class="m-3">
                <div>
                  <p>Amount of bids: ${listing._count.bids}</p>
                  <p>Highest Bid: ${
                    highestBid ? highestBid.amount : "No bids yet"
                  }</p>
                </div>
              </section>
            </div>
          </div>
        `;

        listingDetailsContainer.innerHTML = "";
        listingDetailsContainer.appendChild(listingCard);

        /**
         * Add bid placement form
         */
        const placeBidForm = document.createElement("form");
        placeBidForm.innerHTML = `
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label m-3">Place Bid:</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input class="input" type="number" placeholder="Enter bid amount" id="bidAmount" required />
                  <div class="container mt-3" id="errorContainer"></div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button class="btn btn-primary m-3" type="button" id="placeBidButton">Place Bid</button>
                </div>
              </div>
            </div>
          </div>
        `;
        listingDetailsContainer.appendChild(placeBidForm);

        /**
         * bid placement button click
         */
        const placeBidButton = document.getElementById("placeBidButton");
        placeBidButton.addEventListener("click", () => {
          if (authenticationToken) {
            /**
             * User is authenticated, proceed with bid placement
             */
            const bidAmountInput = document.getElementById("bidAmount");
            const bidAmount = parseFloat(bidAmountInput.value);

            if (!isNaN(bidAmount)) {
              placeBid(listingId, bidAmount)
                .then(() => {
                  fetchListingDetails();
                  bidAmountInput.value = "";
                })
                .catch((error) => {
                  handleErrors(error);
                });
            } else {
              handleErrors(new Error("Invalid bid amount"));
            }
          } else {
            /**
             * User is not authenticated, prompt them to log in or register
             */
            alert("Please log in or register to place a bid or view images.");
          }
        });

        getBidsForListing(listingId)
          .then((bidsData) => {
            /**
             * Process and display the bidsData as needed
             */
            console.log("Bids Data:", bidsData);
          })
          .catch((error) => {
            handleErrors(error);
          });
      }
    })
    .catch((error) => {
      handleErrors(error);
    });
}

/**
 * find the highest bid
 */
function findHighestBid(bids) {
  return bids.reduce((highestBid, currentBid) => {
    return currentBid.amount > (highestBid ? highestBid.amount : 0)
      ? currentBid
      : highestBid;
  }, null);
}

/**
 * Function to handle errors and display messages
 */
function handleErrors(error) {
  console.error("Error handling:", error);

  /**
   * Access the error container in the HTML
   */
  const errorContainer = document.getElementById("errorContainer");

  /**
   * Clear existing error messages
   */
  errorContainer.innerHTML = "";

  /**
   * Display error message
   */
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("alert", "alert-danger");
  errorMessage.textContent =
    "Please try again. A bid has to be made before the listing's deadline, and the bid amount has to be greater than the previous bid.";
  errorContainer.appendChild(errorMessage);
}

/**
 * Function to handle the case when the listing has ended
 */
function handleListingEnded() {
  /**
   * Access the error container in the HTML
   */
  const errorContainer = document.getElementById("errorContainer");

  /**
   * Check if the error container exists
   */
  if (errorContainer) {
    /**
     * Clear error messages
     */
    errorContainer.innerHTML = "";

    /**
     * Display error message
     */
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("alert", "alert-danger");
    errorMessage.textContent =
      "This listing has ended, and you cannot place a bid after the deadline.";
    errorContainer.appendChild(errorMessage);
  } else {
    console.error(
      "Error container not found. Could not display error message."
    );
  }
}
