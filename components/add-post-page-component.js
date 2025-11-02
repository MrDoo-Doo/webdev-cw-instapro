import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { safeFunc } from "../api.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    // @TODO: страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      Cтраница добавления поста
      <div class="upload-image-container"></div>
      <input type="text" id="name-input" class="input" placeholder="Описание" />
      <button class="button" id="add-button">Добавить</button>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      let descriptionPost = document.getElementById("name-input").value;
      onAddPostClick({
        description: safeFunc(descriptionPost),
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
