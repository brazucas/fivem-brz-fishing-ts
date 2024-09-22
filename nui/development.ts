import { hideNui, showNui } from "./dom/containers";

export const startDevelopmentMode = () => {
  showNui();
  $("body").css("background-color", "blue");
};

export const stopDevelopmentMode = () => {
  hideNui();
  $("body").css("background-color", "transparent");
};
