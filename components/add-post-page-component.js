export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      Cтраница добавления поста
      <div class="upload-image-container">
      <div class="upload-image">
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите фото
            </label>
        }
      </div>
      </div>
      <input type="text" id="name-input" class="input" placeholder="Описание" />
      <button class="button" id="add-button">Добавить</button>
    </div>
  `;

    // ${
    //           imageUrl
    //             ? `
    //             <div class="file-upload-image-container">
    //               <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
    //               <button class="file-upload-remove-button button">Заменить фото</button>
    //             </div>
    //             `
    //             : `
    //             <label class="file-upload-label secondary-button">
    //               <input
    //                 type="file"
    //                 class="file-upload-input"
    //                 style="display:none"
    //               />
    //               Выберите фото
    //             </label>
    //           `
    //         }

    appEl.innerHTML = appHtml;

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: "Описание картинки",
        imageUrl: "https://image.png",
      });
    });
  };

  render();
}
