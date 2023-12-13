/**
 * Auction Listings styling using Bulma CSS framework
 */
export function addBulmaCardStyling(targetElement, listings, isPreview) {
  targetElement.innerHTML = "";

  if (listings.length === 0) {
    targetElement.innerHTML = "No listings found.";
  } else {
    listings.forEach((listing) => {
      const card = document.createElement("div");
      card.className = "column";
      card.innerHTML = `
        <div class="card">
          <div class="card-content has-text-centered">
            <p class="title is-4">${listing.title}</p>
            <div class="content">${listing.description}</div>
            <p>Tags: ${listing.tags.join(", ")}</p>
            ${
              listing.media && listing.media.length > 0
                ? `
              <div class="media">
                <div class="media-content feed-img">
                  <img src="${listing.media[0]}" alt="Listing Media">
                </div>
              </div>
            `
                : ""
            }
            <p>Ends At: ${new Date(listing.endsAt).toLocaleString()}</p>
            <section class="m-3">
              <div>
                <p>Bids: ${listing._count.bids}</p>
              </div>
            </section>
            <div class="mt-4">
              <a href="listing-detail.html?id=${
                listing.id
              }" class="button is-primary is-outlined">View Details</a>
            </div>
          </div>
        </div>
      `;

      targetElement.appendChild(card);
    });
  }
}
