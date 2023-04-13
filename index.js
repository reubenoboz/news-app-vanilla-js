// Variables
const newsdetails = document.getElementById("newsdetails");
const nextButton = document.getElementById("next-button");
const previousButton = document.getElementById("previous-button");
let currentPage = 1;
const itemsPerPage = 10;

// Array
let newsDataArr = [];

//APIs
const NEWS_API = "https://61924d4daeab5c0017105f1a.mockapi.io/credo/v1/news?";

window.onload = function () {
  fetchNews(currentPage, itemsPerPage);
};

const fetchNews = async (page, limit) => {
  const response = await fetch(NEWS_API + `page=${page}&limit=${limit}`);
  newsDataArr = [];
  if (response.status >= 200 && response.status < 300) {
    const responseArray = await response.json();
    if (responseArray.length === 0) {
      newsdetails.innerHTML = "<h2 class='no_data'>No News found.</h2>";
    }
    newsDataArr = responseArray;
  } else {
    // handle errors
    console.log(response.status, response.statusText);
    newsdetails.innerHTML = "<h5>Unable to retrieve news info.</h5>";
    return;
  }

  displayNews();
};

const displayNews = () => {
  newsdetails.innerHTML = "";
  newsDataArr.forEach((newsItem) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = `/html/news-details.html?id=${newsItem.id}`;
    });

    const newsAvatar = document.createElement("img");
    newsAvatar.classList.add("card_image");
    newsAvatar.src = newsItem.avatar;

    const newsHeading = document.createElement("h4");
    newsHeading.className = "card_title";
    newsHeading.innerHTML = newsItem.title;

    const newsAuthor = document.createElement("div");
    newsAuthor.className = "card_author";
    newsAuthor.innerHTML = "By: " + newsItem.author;

    card.appendChild(newsAvatar);
    card.appendChild(newsHeading);
    card.appendChild(newsAuthor);

    newsdetails.appendChild(card);
  });
};

nextButton.addEventListener("click", () => {
  currentPage++;
  fetchNews(currentPage, itemsPerPage);
  if (currentPage === 1) {
    previousButton.disabled = true;
  } else {
    previousButton.disabled = false;
  }
});

previousButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(currentPage, itemsPerPage);
    if (currentPage === 1) {
      previousButton.disabled = true;
    } else {
      previousButton.disabled = false;
    }
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
