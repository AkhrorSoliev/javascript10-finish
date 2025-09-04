const loaderContainer = document.querySelector(".loader__container");

export const showLoader = () => {
  loaderContainer.classList.remove("hidden");
};

export const hideLoader = () => {
  loaderContainer.classList.add("hidden");
};
