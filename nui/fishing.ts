import {
  setBaitingAnimation,
  setBaitingCatchOpportunityAnimation,
  setCastDistanceAnimation as setCastDistanceAnimation,
  setFishDistanceAnimation,
  setLineTensionAnimation,
  setInitialFishDistanceAnimation,
  stopBaitingAnimation,
  hideInitialFishDistanceAnimation,
  runReelingKeyPressAnimation,
  setBaitFishDistanceText,
} from "./dom/animations";
import { startDevelopmentMode, stopDevelopmentMode } from "./development";
import {
  containers,
  hideCatchTooltip,
  hideNui,
  showCatchTooltip,
  showContainer,
  showNui,
} from "./dom/containers";
import {
  EmitFish2DPositionAction,
  EmitFishingSetParamAction,
  EmitFishingStateAction,
  FishingAction,
  FishingParam,
  FishingState,
} from "@common/types";

let initialFishDistance = 0;

const setLineTension = setLineTensionAnimation;

const setFishDistance = (distance: number) => {
  const animationPercentageInverted =
    100 - (distance / Math.max(initialFishDistance, distance, 1)) * 100;
  setFishDistanceAnimation(distance, animationPercentageInverted);
};

const setCastingPercentage = (percentage: number) => {
  setCastDistanceAnimation(percentage);
};

const setInitialFishDistance = (distance: number) => {
  if (distance > 0) {
    initialFishDistance = distance;
    setBaitFishDistanceText(distance);
    setInitialFishDistanceAnimation();
  } else {
    hideInitialFishDistanceAnimation();
  }
};

const actionHandlers: {
  [key in FishingAction]: (event: any) => void;
} = {
  "start-fishing": showNui,
  "stop-fishing": hideNui,
  "show-baiting-tooltips": () => {
    stopBaitingAnimation();
    return showCatchTooltip();
  },
  "hide-baiting-tooltips": hideCatchTooltip,
  "reeling-key-pressed": runReelingKeyPressAnimation,
  "set-state": (event: any) => {
    const { state } = event.data as EmitFishingStateAction;
    stateHandlers[state]();
  },
  "set-param": (event: any) => {
    const { param, value } = event.data as EmitFishingSetParamAction;
    paramsHandlers[
      param as keyof Omit<FishingParam, "baseLineTension" | "fishId">
    ]?.(value);
  },
  "fish-2d-position": (event: any) => {
    const { center, posX, posY } = event.data as EmitFish2DPositionAction;

    if (center) {
      $(".minigame-container").css("position", "block");
    } else {
      $(".minigame-container").css("position", "absolute");
      $(".minigame-container").css("left", posX + "px");
      $(".minigame-container").css("top", posY + "px");
    }
  },
};

const stateHandlers: { [key in FishingState]: () => void } = {
  "not-fishing": hideNui,
  casting: () => showContainer("cast"),
  baiting: () => {
    showContainer("baiting");
    $(containers.baiting.children.baitingSpot).fadeIn();
    $(containers.baiting.children.distance).fadeIn();
  },
  reeling: () => showContainer("reeling"),
};

const paramsHandlers: {
  [key in keyof Omit<FishingParam, "baseLineTension" | "fishId">]: (
    value: number
  ) => void;
} = {
  lineTension: setLineTension,
  fishDistance: setFishDistance,
  rodCastPercentage: setCastingPercentage,
  baitingTime: setBaitingAnimation,
  catchOpportunityWindow: (percentage: number) => {
    setBaitingCatchOpportunityAnimation(percentage);
    $(containers.baiting.children.baitingSpot).fadeOut();
    $(containers.baiting.children.distance).fadeOut();
  },
  initialFishDistance: setInitialFishDistance,
};

window.addEventListener("message", (event: any) => {
  const {
    action,
  }: {
    action: FishingAction | undefined | null;
  } = event.data;

  if (action && actionHandlers[action]) {
    actionHandlers[action](event);
    return;
  }

  console.error(`[brz-fishing] Unknown action ${action}`);
});

(window as any).startDevelopmentMode = startDevelopmentMode;
(window as any).setCastDistanceAnimation = setCastDistanceAnimation;
(window as any).stopDevelopmentMode = stopDevelopmentMode;
(window as any).showContainer = showContainer;
(window as any).setInitialFishDistanceAnimation =
  setInitialFishDistanceAnimation;
(window as any).setBaitingAnimation = setBaitingAnimation;
(window as any).setInitialFishDistance = setInitialFishDistance;
(window as any).stopBaitingAnimation = stopBaitingAnimation;
(window as any).setBaitingCatchOpportunityAnimation =
  setBaitingCatchOpportunityAnimation;
