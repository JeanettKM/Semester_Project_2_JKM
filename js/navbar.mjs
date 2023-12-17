export function updateNavbar() {
  // Check for the authentication token in localStorage
  const authenticationToken = localStorage.getItem("accessToken");
  const navLoginFunction = document.getElementById("navLoginFunction");

  // Get the current page URL
  const currentPageUrl = window.location.pathname;

  if (currentPageUrl.includes("listings.html")) {
    // Handle navbar for listings.html
    updateNavbarForListings(authenticationToken, navLoginFunction);
  } else if (currentPageUrl.includes("listing-detail.html")) {
    // Handle navbar for listing-detail.html
    updateNavbarForListingDetail(authenticationToken, navLoginFunction);
  } else if (currentPageUrl.includes("profile2.html")) {
    // Handle navbar for profile2.html
    updateNavbarForProfile(authenticationToken, navLoginFunction);
  } else {
    // Handle navbar for other pages (default)
    updateNavbarForOtherPages(authenticationToken, navLoginFunction);
  }
}

function updateNavbarForListings(authenticationToken, navLoginFunction) {
  if (authenticationToken) {
    // Display the logout button
    navLoginFunction.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-info">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="profile2.html">Your profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="loginLogoutLink">Log out</a>
              </li>
            </ul>
          </div>
        </nav>
      `;
    // Event listener for logout
    const logoutLink = document.getElementById("loginLogoutLink");
    logoutLink.addEventListener("click", () => {
      // Remove the authentication token
      localStorage.removeItem("accessToken");
      // Redirect to index.html
      window.location.href = "index.html";
    });
  } else {
    // Display the login button
    navLoginFunction.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-info">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="index.html">Log in or Register an account</a>
              </li>
            </ul>
          </div>
        </nav>
      `;
  }
}

function updateNavbarForListingDetail(authenticationToken, navLoginFunction) {
  // function for listing-detail.html
  if (authenticationToken) {
    // Display the logout button
    navLoginFunction.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-info">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="listings.html">View Listings</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="profile2.html">Your profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="loginLogoutLink">Log out</a>
              </li>
            </ul>
          </div>
        </nav>
      `;
    // Attach event listener for logout
    const logoutLink = document.getElementById("loginLogoutLink");
    logoutLink.addEventListener("click", () => {
      // Remove the authentication token
      localStorage.removeItem("accessToken");
      // Redirect to index.html
      window.location.href = "index.html";
    });
  } else {
    // Display the login button
    navLoginFunction.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-info">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" href="listings.html">View Listings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="index.html" id="loginLogoutLink">Log in or Register</a>
        </li>
      </ul>
    </div>
  </nav>
`;
  }
}

function updateNavbarForProfile(authenticationToken, navLoginFunction) {
  // function for profile2.html
  if (authenticationToken) {
    // Display the logout button
    navLoginFunction.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-info">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="listings.html">View Listings</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="loginLogoutLink">Log out</a>
              </li>
            </ul>
          </div>
        </nav>
      `;
    // event listener for logout
    const logoutLink = document.getElementById("loginLogoutLink");
    logoutLink.addEventListener("click", () => {
      // Remove the authentication token
      localStorage.removeItem("accessToken");
      // Redirect to index.html
      window.location.href = "index.html";
    });
  } else {
    // Display the login button
    navLoginFunction.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-info">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="listings.html">View Listings</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="loginLogoutLink">Log in</a>
              </li>
            </ul>
          </div>
        </nav>
      `;
  }
}

// existing logic for other pages
function updateNavbarForOtherPages(authenticationToken, navLoginFunction) {
  if (authenticationToken) {
    // Display the logout button
    navLoginFunction.innerHTML = `<a class="nav-link" href="#" id="loginLogoutLink">Log out</a>`;

    // event listener for logout
    const logoutLink = document.getElementById("loginLogoutLink");
    logoutLink.addEventListener("click", () => {
      // Remove the authentication token
      localStorage.removeItem("accessToken");
      // Redirect to index.html
      window.location.href = "index.html";
    });
  } else {
    // Display the login button
    navLoginFunction.innerHTML = `<a class="nav-link" href="#" id="loginLogoutLink">Log in</a>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // update the navbar
  updateNavbar();
});
