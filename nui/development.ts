import { hideNui, showNui } from "./dom/containers";

let keyDownBind: JQuery<Document>;
let keyUpBind: JQuery<Document>;

export const startDevelopmentMode = () => {
  showNui();
  $("body").css("background-color", "blue");
};

export const stopDevelopmentMode = () => {
  hideNui();
  $("body").css("background-color", "transparent");
};
