import { axiosInstance } from "./request.js";
const template = document.getElementById("comment-card");
const commentCards = document.querySelector(".comment-cards");

const rendeReplies = (replies) => {
  console.log(replies);
};

const renderComment = (comments) => {
  comments.forEach((comment) => {
    const { id, content, createdAt, score, user, replies } = comment;

    // clone template
    const clone = template.content.cloneNode(true);

    // select elements from template
    const pictureEl = clone.querySelector("picture");
    const sourceWebp = pictureEl.querySelector('source[type="image/webp"]');
    const imgEl = pictureEl.querySelector("img.comment-card__avatar");

    const card__username = clone.querySelector(".comment-card__username");
    const card__time = clone.querySelector(".comment-card__time");
    const card__body = clone.querySelector(".comment-card__body");
    const card__amount = clone.querySelector(".amount");

    // give data to seleted elements
    card__username.textContent = user.username;
    card__time.textContent = createdAt;
    card__body.textContent = content;
    card__amount.textContent = score;
    if (user?.image?.webp && sourceWebp) {
      sourceWebp.srcset = user.image.webp;
    }
    if (user?.image?.png && imgEl) {
      imgEl.src = user.image.png;
    }
    if (imgEl) {
      imgEl.alt = `${user?.username ?? "User"} avatar`;
    }

    // replies rendering
    if (replies.length > 0) {
      rendeReplies(replies);
    }

    // rendering cart to ui
    commentCards.appendChild(clone);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axiosInstance("/comments");
    renderComment(res.data);
  } catch (error) {
    console.log(error.message);
  } finally {
  }
});
