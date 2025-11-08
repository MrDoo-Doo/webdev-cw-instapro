import { getPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import {
  renderPostsPageComponent,
  renderUserPostsPageComponent,
} from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
let userId;

export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // @@TODO: реализовать получение постов юзера из API
      userId = data.userId;
      console.log("Открываю страницу пользователя: ", data.userId);
      page = LOADING_PAGE;
      posts = [];
      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // @TODO: реализовать добавление поста в API "Content-Type": "application/json",
        const personalKey = "efremov";
        const baseHost = "https://webdev-hw-api.vercel.app";
        const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

        return fetch(postsHost, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            description: description,
            imageUrl: imageUrl,
          }),
        }).then((response) => {
          console.log("Добавляю пост...", { description, imageUrl });
          goToPage(POSTS_PAGE);

          return response.json();
        });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // @TODO: реализовать страницу с фотографиями отдельного пользвателя
    // appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    return renderUserPostsPageComponent({ appEl, userId });
  }
};

export function addLike({ postId, token, likeStatus, pageNum }) {
  const personalKey = "efremov";
  const baseHost = "https://webdev-hw-api.vercel.app";

  if (likeStatus === "false") {
    console.log("+Tap");
    fetch(`${baseHost}/api/v1/${personalKey}/instapro/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Like error");
        }
        return response.json();
      })
      .then(() => {
        return getPosts({ token: getToken() })
          .then((newPosts) => {
            if (pageNum == 1) {
              page = POSTS_PAGE;
            } else {
              page = USER_POSTS_PAGE;
            }
            posts = newPosts;
            renderApp();
          })
          .catch((error) => {
            console.error(error);
            if (pageNum == 1) {
              goToPage(POSTS_PAGE);
            } else {
              goToPage(USER_POSTS_PAGE);
            }
          });
      });
  } else {
    console.log("-Tap");
    fetch(`${baseHost}/api/v1/${personalKey}/instapro/${postId}/dislike`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Like error");
        }
        return response.json();
      })
      .then(() => {
        return getPosts({ token: getToken() })
          .then((newPosts) => {
            if (pageNum == 1) {
              page = POSTS_PAGE;
            } else {
              page = USER_POSTS_PAGE;
            }
            posts = newPosts;
            renderApp();
          })
          .catch((error) => {
            console.error(error);
            if (pageNum == 1) {
              goToPage(POSTS_PAGE);
            } else {
              goToPage(USER_POSTS_PAGE);
            }
          });
      });
  }
}
goToPage(POSTS_PAGE);
