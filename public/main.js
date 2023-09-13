/**
 * Generate a json web token for the user's browser
 * @returns {string} - A web token in JSON format
 */
const generateShortenedLinkKey = async () => {
  try {
    const response = await fetch("/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Authentication error:", error);
  }
};

/**
 * Fetch the shortened links from server and display them
 * @param {String} userKey - a json web token that is stored in a local storage
 */
const fetchShortenedLinksFromServer = (userKey) => {
  // Make a GET request to the server to fetch the user's shortened links
  fetch(`/api/shortened-links?userKey=${userKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //clear the table's body before adding any links
      document.querySelector(".tbody").innerHTML = "";

      //add all the user's links to the table's body
      data.forEach((el) => {
        document.querySelector(".tbody").innerHTML += `
          <tr>
            <!-- desktop -->
            <td class="desktop-columns long-url">
              <a href="${el.full}">${el.full}</a>
            </td>
            <td class="desktop-columns">
              <a class="short-urls" href="${el.short}">${el.short}</a>
            </td>
            <td class="desktop-columns">${el.clicks}</td>

            <!-- mobile -->
            <td colspan="3" class="column-td">
              <div class="column-flex">
                <a href="${el.full}">${el.full}</a>
                <a class="short-urls" href="${el.short}"
                  >${el.short}</a
                >
                ${el.clicks}
              </div>
            </td>
            <td>
              <img
                src="${el.qrImage + el.short}"
                alt="qr-code"
                class="qr-code-img"
              />
            </td>
          </tr>
      `;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
};

/**
 * When the user revisits the website, retrieve the key and fetch their shortened links
 */
const userKey = localStorage.getItem("shortenedLinkKey");
if (userKey) {
  fetchShortenedLinksFromServer(userKey);
}
//if user's there for the first time, create a token and store it in local storage
else if (userKey == undefined || !userKey) {
  generateShortenedLinkKey().then((token) => {
    localStorage.setItem("shortenedLinkKey", token);
  });
}

/**
 * Send token and full url to server in json format
 */
const sendDataToServer = () => {
  const key = localStorage.getItem("shortenedLinkKey");
  const fullUrl = document.querySelector("#fullUrl");
  const full = fullUrl.value;

  // Create an object with the key to send in the request body
  const data = { key, full };

  // Make a POST request to your server
  fetch("/shortUrls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convert the data object to JSON
  }).catch((error) => {
    console.error("Shorten link error:", error);
  });
};

/**
 * When form is submitted, send token and full url to server
 */
document.querySelector("#submit-btn").addEventListener("click", (event) => {
  event.preventDefault();
  sendDataToServer();
  window.location.href = "/";
});
