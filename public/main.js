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

// get the shortened links from server and display them
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
      //clear before adding
      document.querySelector(".tbody").innerHTML = "";

      //add all the user's links
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

// When the user revisits the website, retrieve the key and fetch their shortened links
const userKey = localStorage.getItem("shortenedLinkKey");
if (userKey) {
  fetchShortenedLinksFromServer(userKey);
} else if (userKey == undefined || !userKey) {
  generateShortenedLinkKey().then((token) => {
    localStorage.setItem("shortenedLinkKey", token);
  });
}

const sendTokenToServer = () => {
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

document.querySelector("#submit-btn").addEventListener("click", (event) => {
  event.preventDefault();
  sendTokenToServer();
  window.location.href = "/";
});
