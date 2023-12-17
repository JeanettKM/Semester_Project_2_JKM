const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";

export async function placeBid(listingId, bidAmount) {
  try {
    const authenticationToken = localStorage.getItem("accessToken");

    if (!authenticationToken) {
      alert("Please log in or register to place a bid.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/listings/${listingId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authenticationToken}`,
      },
      body: JSON.stringify({
        amount: bidAmount,
      }),
    });

    if (response.ok) {
      const bidData = await response.json();
      console.log("Bid placed successfully!", bidData);
    } else {
      const errorContent = await response.json();
      console.error("Error placing bid:", errorContent);
      throw new Error(
        `Could not place the bid. ${JSON.stringify(errorContent)}`
      );
    }
  } catch (error) {
    throw error;
  }
}

export async function getBidsForListing(listingId) {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const bidsData = await response.json();
      console.log("Bids retrieved successfully!", bidsData);
    } else {
      const errorContent = await response.json();
      console.error("Error retrieving bids:", errorContent);
      throw new Error(`Could not find bids. ${JSON.stringify(errorContent)}`);
    }
  } catch (error) {
    throw error;
  }
}
