const newsForm = document.getElementById("#news_form");
const titleInput = document.getElementById("#title");
const avatarInput = document.getElementById("#avatar");
const authorInput = document.getElementById("#author");
const urlInput = document.getElementById("#url");

const NEWS_API = "https://61924d4daeab5c0017105f1a.mockapi.io/credo/v1/news/";

// Create a news article
newsForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const data = {
    title: titleInput.value,
    avatar: avatarInput.value,
    author: authorInput.value,
    url: urlInput.value,
  };

  let response = await fetch(`${NEWS_API}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 200 && response.status < 300) {
    alert("Success: News aritcle created");

    titleInput.value = "";
    avatarInput.value = "";
    authorInput.value = "";
    urlInput.value = "";
  } else {
    // handle errors
    const responseData = await response.json();
    alert("Error: " + responseData);
  }
});
