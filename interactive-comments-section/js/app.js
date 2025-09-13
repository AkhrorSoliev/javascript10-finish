import { axiosInstance } from "./request.js";
const template = document.getElementById("comment-card");
const commentCards = document.querySelector(".comment-cards");
const commentReplies = document.getElementById("comment-replies");
const commentReply = document.getElementById("comment-reply");

window.replyButton = function (btn) {
  document
    .querySelector(".comment-cards")
    .querySelectorAll(".reply-container")
    .forEach((item) => item.remove());

  const parentEl = btn.closest("li");
  const clone = commentReply.content.cloneNode(true);

  if (parentEl.classList.contains("comment-card__element")) {
    const comments = parentEl.querySelector(".comment-replies");
    if (comments.children.length == 0) {
      parentEl.after(clone);
    } else {
      comments.before(clone);
    }
  }

  if (parentEl.classList.contains("comment-card__item")) {
    parentEl.style.marginBottom = "1.6rem";
    parentEl.after(clone);
  }
};

window.increment = async function (btn) {
  if (btn.dataset.name == "reply") {
    const mainId = btn.dataset.mainId;
    const commentId = btn.dataset.commentId;
    const res = await axiosInstance(`/comments/${mainId}`);
    const comment = {
      ...res.data.replies.find((item) => item.id == commentId),
    };
    comment.score = comment.score + 1;
    console.log(comment);
    // const req = await axiosInstance(`/comments/${mainId}`, {
    //   method: "PUT",
    //   body: res.data,
    // });
    // console.log(req);
  }
};

window.decrement = function (btn) {
  console.log(btn);
};

let currentUser;

const rendeReplies = (replies, container, mainId) => {
  replies.forEach((reply) => {
    const { id, content, createdAt, score, user, replyingTo } = reply;
    const clone = commentReplies.content.cloneNode(true);

    // select elements from template
    const pictureEl = clone.querySelector("picture");
    const sourceWebp = pictureEl.querySelector('source[type="image/webp"]');
    const imgEl = pictureEl.querySelector("img.comment-card__avatar");

    const card__username = clone.querySelector(".comment-card__username");
    const card__time = clone.querySelector(".comment-card__time");
    const card__body = clone.querySelector(".comment-card__body");
    const card__amount = clone.querySelector(".amount");
    const card__owner = clone.querySelector(".comment-card__owner");
    const card_increment_btn = clone.querySelector(".btn-increase");
    const card_decrement_btn = clone.querySelector(".btn-decrease");

    if (currentUser.username == user.username) {
      card__owner.style.display = "block";
    }

    // give data to seleted elements
    card__username.textContent = user.username;
    card__time.textContent = createdAt;
    card__body.innerHTML = `<a href="#" class="comment-card__replyTo"> @${replyingTo}</a> ${content}`;
    card__amount.textContent = score;
    card_increment_btn.dataset.commentId = id;
    card_decrement_btn.dataset.commentId = id;
    card_decrement_btn.dataset.mainId = mainId;
    card_increment_btn.dataset.mainId = mainId;

    if (user?.image?.webp && sourceWebp) {
      sourceWebp.srcset = user.image.webp;
    }
    if (user?.image?.png && imgEl) {
      imgEl.src = user.image.png;
    }
    if (imgEl) {
      imgEl.alt = `${user?.username ?? "User"} avatar`;
    }

    // rendering cart to ui
    container.appendChild(clone);
  });
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
    const card_increment_btn = clone.querySelector(".btn-increase");
    const card_decrement_btn = clone.querySelector(".btn-decrease");

    // give data to seleted elements
    card__username.textContent = user.username;
    card__time.textContent = createdAt;
    card__body.textContent = content;
    card__amount.textContent = score;
    card_increment_btn.dataset.commentId = id;
    card_decrement_btn.dataset.commentId = id;

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
      const commentReplies = clone.querySelector(".comment-replies");
      rendeReplies(replies, commentReplies, id);
    }

    // rendering cart to ui
    commentCards.appendChild(clone);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const resCurrentUser = await axiosInstance("/currentUser");
    currentUser = resCurrentUser.data;

    const resComments = await axiosInstance("/comments");
    renderComment(resComments.data);
  } catch (error) {
    console.log(error.message);
  } finally {
  }
});
