import { castMinigameTemplate } from "./cast-minigame.template";
import { baitingMinigameTemplate } from "./baiting-minigame.template";
import { reelingMinigameTemplate } from "./reeling-minigame.template";

export const containers = {
  cast: {
    selector: "#cast-minigame",
    template: castMinigameTemplate,
    children: {
      castDistanceIndicator: ".castDistanceIndicator",
      toast: ".toast",
    },
  },
  baiting: {
    selector: "#baiting-minigame",
    template: baitingMinigameTemplate,
    children: {
      catchOpportunityIndicator: "#catchOpportunityIndicator",
      distance: "#distance",
      baitingSpot: "#baitingSpot",
      catchTooltip: ".catchTooltip",
    },
  },
  reeling: {
    selector: "#reeling-minigame",
    template: reelingMinigameTemplate,
    children: {
      lineTension: `#lineTension`,
      fishDistanceIndicator: `#fishDistanceIndicator`,
      fishDistanceText: "#fishDistanceText",
      lineTensionBackground: `#lineTensionBackground`,
      reelingKeyPress: ".reelingKeyPress",
    },
  },
};

const fadeAnimationDuration = 200;

const hideAllContainers = () => {
  Object.values(containers).forEach((container) => {
    $(container.selector).hide();
  });
};

export const hideNui = () => {
  $("body").css("opacity", 0);
};

export const showNui = () => {
  $(".minigame-container").css("position", "block");
  $("body").css("opacity", 1);
};

export const showContainer = (container: keyof typeof containers) => {
  hideAllContainers();

  $(containers[container].selector).css("opacity", 1);
  $(containers[container].selector + ".minigame-container").css("opacity", 1);
  $(containers[container].selector).fadeIn({
    duration: fadeAnimationDuration,
  });
};

export const showCatchTooltip = () => {
  $(containers.baiting.children.catchTooltip).fadeIn();
};

export const hideCatchTooltip = () => {
  $(containers.baiting.children.catchTooltip).fadeOut();
};
