/**
 * Auction Listings styling using Bootstrap classes
 */
export function addBootstrapCardStyling(targetElement, listings, isPreview) {
  targetElement.innerHTML = "";

  if (listings.length === 0) {
    targetElement.innerHTML = "No listings found.";
  } else {
    listings.forEach((listing, index) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4"; // Adjusted width to col-md-4
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body d-flex flex-column text-center">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
            <p class="card-text"><small class="text-muted">Tags: ${listing.tags.join(
              ", "
            )}</small></p>
            ${
              listing.media && listing.media.length > 0
                ? `
              <div class="media">
                <img src="${listing.media[0]}" class="card-img-top" alt="Listing Media">
              </div>
            `
                : ""
            }
            <p class="card-text mt-auto">Ends At: ${new Date(
              listing.endsAt
            ).toLocaleString()}</p>
            <div class="mt-3">
              <p class="card-text">Bids: ${listing._count.bids}</p>
            </div>
            <div class="mt-3">
              <a href="listing-detail.html?id=${
                listing.id
              }" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      `;

      // If it's the first card in a row, create a new row
      if (index % 3 === 0) {
        const row = document.createElement("div");
        row.className = "row";
        targetElement.appendChild(row);
      }

      // Append the card to the last row
      const rows = targetElement.getElementsByClassName("row");
      const lastRow = rows[rows.length - 1];
      lastRow.appendChild(card);
    });
  }
}
