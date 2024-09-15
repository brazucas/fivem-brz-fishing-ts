import { containers } from "./containers";

Object.values(containers).forEach((container) => {
  $("body").append(container.template);
});
