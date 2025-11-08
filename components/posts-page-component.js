import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, page } from "../index.js";
import { addLike } from "../index.js";

import { formatDistanceToNow } from "https://esm.sh/date-fns";
import { ru } from "https://cdn.skypack.dev/date-fns/locale";

/**
 * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
 * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
 */

export function renderPostsPageComponent({ appEl }) {
  const postsArr = posts
    .map((post) => {
      let createdPost = new Date(post.createdAt);
      let formTime = formatDistanceToNow(createdPost, {
        addSuffix: true,
        locale: ru,
      });
      return `<li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" data-status="${
        post.isLiked
      }" class="like-button">
                        ${
                          post.isLiked
                            ? `
                        <img src="./assets/images/like-active.svg">
                        `
                            : `
                        <img src="./assets/images/like-not-active.svg">
                        `
                        }
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${
                          Object.keys(post.likes).length
                        }</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${formTime}
                    </p>
                  </li>`;
    })
    .join("");

  const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">${postsArr}</ul>
  </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  let pageNum = 1;
  Like({ pageNum });
}

export function renderUserPostsPageComponent({ appEl, userId }) {
  const postsArr = posts
    .map((post) => {
      let createdPost = new Date(post.createdAt);
      let formTime = formatDistanceToNow(createdPost, {
        addSuffix: true,
        locale: ru,
      });
      if (post.user.id === userId) {
        return `<li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" data-status="${
          post.isLiked
        }" class="like-button">
                      ${
                        post.isLiked
                          ? `
                        <img src="./assets/images/like-active.svg">
                        `
                          : `
                        <img src="./assets/images/like-not-active.svg">
                        `
                      }
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${
                          Object.keys(post.likes).length
                        }</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${formTime}
                    </p>
                  </li>`;
      }
    })
    .join("");

  const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">${postsArr}</ul>
  </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  let pageNum = 0;
  Like({ pageNum });
}

export function Like({ pageNum }) {
  const arrayLike = document.querySelectorAll(".like-button");
  for (const like of arrayLike) {
    like.addEventListener("click", (e) => {
      e.stopPropagation();
      let postId = like.getAttribute("data-post-id");
      let likeStatus = like.dataset.status;

      addLike({
        postId,
        token: `Bearer ${user.token}`,
        likeStatus,
        pageNum,
      });
    });
  }
}
