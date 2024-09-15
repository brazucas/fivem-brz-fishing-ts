import { maxLineHeight, minLineHeight } from "./cast-minigame.template";
import { containers } from "./containers";

const lineTensionBackground = anime({
  targets: containers.reeling.children.lineTensionBackground,
  ry: "20%",
  easing: "easeInOutSine",
  duration: 100,
  loop: false,
  autoplay: false,
});

const distanceFilling = anime({
  targets: containers.reeling.children.fishDistanceIndicator,
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: "easeInOutSine",
  duration: 100,
  loop: false,
  autoplay: false,
});

const lineTension = anime({
  targets: containers.reeling.children.lineTension,
  ry: "20%",
  easing: "easeInOutSine",
  duration: 100,
  loop: false,
  autoplay: false,
  keyframes: [
    { value: 0, fill: "#00ff00" },
    { value: 600, fill: "#ffff00" },
    { value: 1300, fill: "#ff0000" },
  ],
  update: function (anim) {
    if (anim.progress > 90) {
      shakeElement(containers.reeling.selector, "hard");
    } else if (anim.progress > 70) {
      shakeElement(containers.reeling.selector, "medium");
    } else if (anim.progress > 50) {
      shakeElement(containers.reeling.selector, "light");
    } else {
      stopShakingElement(containers.reeling.selector);
    }
  },
});

anime({
  targets: containers.baiting.children.catchTooltip,
  opacity: 0.5,
  strokeOpacity: 1,
  easing: "easeInOutSine",
  duration: 500,
  loop: true,
  autoplay: true,
});

const reelingKeyPress = anime({
  targets: containers.reeling.children.reelingKeyPress,
  opacity: 1,
  keyframes: [
    { value: 0, opacity: 1 },
    { value: 50, opacity: 0.5 },
    { value: 100, opacity: 1 },
  ],
  strokeOpacity: 1,
  easing: "easeInOutSine",
  duration: 300,
  loop: false,
  autoplay: false,
});

const castDistance = anime({
  targets: containers.cast.children.castDistanceIndicator,
  keyframes: [
    {
      cy: minLineHeight,
    },
    {
      cy: maxLineHeight,
    },
  ],
  elasticity: 100,
  easing: "easeInOutSine",
  duration: 100,
  loop: false,
  autoplay: false,
});

const batiting = anime({
  targets: containers.baiting.selector,
  easing: "easeInOutSine",
  duration: 100,
  loop: false,
  autoplay: false,
  update: (anim) => {
    if (anim.progress > 80) {
      shakeElement(containers.baiting.selector, "hard");
    } else if (anim.progress > 50) {
      shakeElement(containers.baiting.selector, "medium");
    } else {
      shakeElement(containers.baiting.selector, "light");
    }
  },
});

const batitingCatchOpportunity = anime({
  targets: containers.baiting.children.catchOpportunityIndicator,
  strokeDashoffset: [anime.setDashoffset, 0],
  keyframes: [
    { value: 0, stroke: "#00ff00" },
    { value: 50, stroke: "#ffff00" },
    { value: 100, stroke: "#ff0000" },
  ],
  easing: "easeInOutSine",
  duration: 100,
  loop: false,
  autoplay: false,
});

export const setLineTensionAnimation = (value: number) => {
  lineTensionBackground.seek(value);
  lineTension.seek(value);
};

export const setFishDistanceAnimation = (
  distance: number,
  animationPercentageInverted: number
) => {
  $(containers.reeling.children.fishDistanceText).text(
    distance.toFixed(2) + "m"
  );

  distanceFilling.seek(animationPercentageInverted);
};

export const setCastDistanceAnimation = (percentage: number) => {
  castDistance.seek(percentage);
  $(`${containers.cast.selector} ${containers.cast.children.toast}`).attr(
    "y",
    Number($(containers.cast.children.castDistanceIndicator).attr("cy"))
  );
};

export const setBaitFishDistanceText = (distance: number) =>
  $(containers.baiting.children.distance).text(distance.toFixed(2) + "m");

export const setInitialFishDistanceAnimation = () => {
  const parentContainerSelector = containers.cast.selector;

  $(`${parentContainerSelector} .toast`).text("SHORT");
  $(`${parentContainerSelector} .toast`).fadeIn();
};

export const hideInitialFishDistanceAnimation = () => {
  const parentContainerSelector = containers.cast.selector;
  $(`${parentContainerSelector} .toast`).fadeOut();
};

export const setBaitingAnimation = (percentage: number) => {
  batiting.seek(percentage);
};

export const stopBaitingAnimation = () => {
  stopShakingElement(containers.baiting.selector);
};

export const setBaitingCatchOpportunityAnimation = (percentage: number) => {
  batitingCatchOpportunity.seek(percentage);
};

export const runReelingKeyPressAnimation = () => {
  reelingKeyPress.play();
};

const shakeIntensity = {
  hard: "hard",
  medium: "medium",
  light: "light",
} as const;

const shakeElement = (
  selector: string,
  intensity: keyof typeof shakeIntensity
) => {
  $(selector).addClass(`shake-${intensity}`);

  const classesToRemove = Object.values(
    Object.assign({}, shakeIntensity)
  ).filter((_class) => _class !== intensity);

  classesToRemove.forEach((_class) => {
    $(selector).removeClass(`shake-${_class}`);
  });
};

const stopShakingElement = (selector: string) => {
  Object.values(shakeIntensity).forEach((intensity) => {
    $(selector).removeClass(`shake-${intensity}`);
  });
};
