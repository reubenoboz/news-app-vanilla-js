const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("id");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const sliderContainer = document.querySelector(".slider_container");
const commentForm = document.getElementById("#comment_form");
const nameInput = document.getElementById("#name");
const avatarInput = document.getElementById("#avatar");
const commentInput = document.getElementById("#comment");
const commentNameInput = document.getElementById("#comment_name");
const commentAvatarInput = document.getElementById("#comment_avatar");
const commentDataInput = document.getElementById("#comment_data");

const commentsDiv = document.querySelector(".comments");
const titleDiv = document.querySelector(".title");

let currentIndex = 0;
let newsItem = null;
let newsComments = [];
let newsImages = [];

const NEWS_API = "https://61924d4daeab5c0017105f1a.mockapi.io/credo/v1/news/";

window.onload = function () {
  fetchDetails(postId);
  fetchComments(postId);
  fetchImages(postId);
};

const formatDate = (date) => {
  const dateToFormat = new Date(date);
  const options = { year: "numeric", month: "numeric", day: "numeric" };

  const time =
    (dateToFormat.getHours() > 10
      ? dateToFormat.getHours()
      : `0${dateToFormat.getHours()}`) +
    ":" +
    (dateToFormat.getMinutes() > 10
      ? dateToFormat.getMinutes()
      : `0${dateToFormat.getMinutes()}`);
  const day = dateToFormat.toLocaleDateString("en-NG", options);

  return `${day} ${time}`;
};

const fetchDetails = async (postId) => {
  const response = await fetch(NEWS_API + postId);
  newsItem = null;
  if (response.status >= 200 && response.status < 300) {
    const responseJson = await response.json();
    if (responseJson.length === 0) {
      newsdetails.innerHTML = "<h2 class='no_data'>No News found.</h2>";
    }
    newsItem = responseJson;
  } else {
    // handle errors
    newsdetails.innerHTML = "<h5>Unable to retrieve news details.</h5>";
    return;
  }

  displayDetails();
};

const displayDetails = () => {
  titleDiv.innerHTML = `<h1>${newsItem.title}</h1>`;
  const authorContainer = document.createElement("p");
  authorContainer.classList.add("author");
  authorContainer.innerHTML = `By: ${newsItem.author}`;

  titleDiv.appendChild(authorContainer);
};

const fetchImages = async (postId) => {
  const response = await fetch(NEWS_API + postId + "/images");
  newsImages = [];
  if (response.status >= 200 && response.status < 300) {
    const responseArray = await response.json();
    if (responseArray.length === 0) {
      sliderContainer.innerHTML = "<h2 class='no_data'>No Images.</h2>";
    }
    newsImages = responseArray;
  } else {
    // handle errors
    sliderContainer.innerHTML =
      "<h5 class='no_data'>Unable to retrieve images.</h5>";
    return;
  }

  displayImages(currentIndex);
};

const displayImages = (index) => {
  currentIndex = index;
  newsImages.forEach((img, i) => {
    const image = document.createElement("img");
    image.classList.add("slider_img");
    image.src = img.image;
    if (index === i) {
      image.style.display = "block";
    } else image.style.display = "none";
    sliderContainer.appendChild(image);
  });
};

function showPrev() {
  const prevIndex = (currentIndex - 1 + newsImages.length) % newsImages.length;
  displayImages(prevIndex);
}

function showNext() {
  const nextIndex = (currentIndex + 1) % newsImages.length;
  displayImages(nextIndex);
}

prevBtn.addEventListener("click", showPrev);
nextBtn.addEventListener("click", showNext);

setInterval(() => {
  showNext();
}, 5000);

const fetchComments = async (postId) => {
  const response = await fetch(NEWS_API + postId + "/comments");
  newsComments = [];
  if (response.status >= 200 && response.status < 300) {
    const responseArray = await response.json();
    if (responseArray.length === 0) {
      commentsDiv.innerHTML = "<h2 class='no_data'>No Comments.</h2>";
      return;
    }
    newsComments = responseArray;
  } else {
    // handle errors
    commentsDiv.innerHTML = "<h5>Unable to retrieve comments.</h5>";
    return;
  }

  displayComments();
};

const displayComments = () => {
  commentsDiv.innerHTML = "";
  newsComments.forEach((comment) => {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("comment_container");

    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar_container");

    const commentAvatar = document.createElement("img");
    commentAvatar.classList.add("comment_image");
    commentAvatar.id = "#comment_avatar";
    commentAvatar.src = comment.avatar;

    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");

    const commentName = document.createElement("h4");
    commentName.className = "comment_name";
    commentName.id = "#comment_name";
    commentName.innerHTML = comment.name;

    const commentData = document.createElement("div");
    commentData.className = "comment_data";
    commentData.id = "#comment_data";
    commentData.innerHTML = comment.comment;

    const editBtn = document.createElement("div");
    editBtn.classList.add("edit_del_btns");
    editBtn.innerHTML = `<div id="#action_container" class="action_container">
    <div id="#edit_comment" class="edit_comment" data-id="${comment.id}" data-name="${comment.name}" data-avatar="${comment.avatar}" data-comment="${comment.comment}">Edit</div>
    <div id="#delete_comment" class="delete_comment" data-id="${comment.id}">Delete</div>
    </div>`;

    const commentDate = document.createElement("div");
    commentDate.className = "comment_date";
    commentDate.innerHTML =
      "<b>Created At: </b>" + formatDate(comment.createdAt);

    avatarDiv.appendChild(commentAvatar);
    commentDiv.appendChild(commentName);
    commentDiv.appendChild(commentData);
    commentDiv.appendChild(editBtn);
    commentDiv.appendChild(commentDate);

    commentContainer.appendChild(avatarDiv);
    commentContainer.appendChild(commentDiv);

    commentsDiv.appendChild(commentContainer);
  });
};

// Post a Comment
commentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const data = {
    name: nameInput.value,
    avatar: avatarInput.value,
    comment: commentInput.value,
  };

  let response = await fetch(`${NEWS_API}${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 200 && response.status < 300) {
    alert("Success: Comment posted");
    fetchComments(postId);

    nameInput.value = "";
    avatarInput.value = "";
    commentInput.value = "";
  } else {
    // handle errors
    const responseData = await response.json();
    alert("Error: " + responseData);
  }
});

// Handle Edit and Delete Comment Button
commentsDiv.addEventListener("click", function (event) {
  if (event.target.matches(".edit_comment")) {
    const commentId = event.target.getAttribute("data-id");
    const commentName = event.target.getAttribute("data-name");
    const commentAvatar = event.target.getAttribute("data-avatar");
    const commentData = event.target.getAttribute("data-comment");
    nameInput.value = commentName;
    avatarInput.value = commentAvatar;
    commentInput.value = commentData;
  }

  if (event.target.matches(".delete_comment")) {
    const commentId = event.target.getAttribute("data-id");
    deleteComment(commentId);
  }
});

const deleteComment = async (id) => {
  const response = await fetch(`${NEWS_API}${postId}/comments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 200 && response.status < 300) {
    fetchComments(postId);
  } else {
    // handle errors
    const responseData = await response.json();
    alert("Error" + responseData);
  }
};
