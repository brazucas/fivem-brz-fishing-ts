const animeInstances: {
  [key: string]: {
    seek: (percentage: number) => void;
    play: () => void;
    update?: (percentage: number) => void;
  };
} = {};

(globalThis as any).anime = jest.fn().mockImplementation((params: any) => {
  const seekFn = jest.fn();
  const playFn = jest.fn();

  animeInstances[params.targets] = {
    seek: seekFn,
    play: playFn,
    update: params.update,
  };

  return {
    seek: seekFn,
    play: playFn,
  };
});

import {
  hideInitialFishDistanceAnimation,
  runReelingKeyPressAnimation,
  setBaitFishDistanceText,
  setBaitingAnimation,
  setBaitingCatchOpportunityAnimation,
  setCastDistanceAnimation,
  setFishDistanceAnimation,
  setInitialFishDistanceAnimation,
  setLineTensionAnimation,
  stopBaitingAnimation,
} from "../../dom/animations";

describe("animations", () => {
  const fishDistanceText = jest.fn();
  const castMinigameToastAttr = jest.fn();
  const castMinigameToastText = jest.fn();
  const castMinigameToastFadeIn = jest.fn();
  const castMinigameToastFadeOut = jest.fn();
  const castDistanceIndicatorAttr = jest.fn();
  const baitDistanceText = jest.fn();
  const baitingMinigameRemoveClass = jest.fn();
  const baitingMinigameAddClass = jest.fn();
  const reelingMinigameRemoveClass = jest.fn();
  const reelingMinigameAddClass = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    (globalThis as any).$ = jest
      .fn()
      .mockImplementation((container: string) => {
        if (container === "#fishDistanceText") {
          return {
            text: fishDistanceText,
          };
        }

        if (container === "#cast-minigame .toast") {
          return {
            attr: castMinigameToastAttr,
            text: castMinigameToastText,
            fadeIn: castMinigameToastFadeIn,
            fadeOut: castMinigameToastFadeOut,
          };
        }

        if (container === ".castDistanceIndicator") {
          return {
            attr: castDistanceIndicatorAttr,
          };
        }

        if (container === "#distance") {
          return {
            text: baitDistanceText,
          };
        }

        if (container === "#baiting-minigame") {
          return {
            removeClass: baitingMinigameRemoveClass,
            addClass: baitingMinigameAddClass,
          };
        }

        if (container === "#reeling-minigame") {
          return {
            removeClass: reelingMinigameRemoveClass,
            addClass: reelingMinigameAddClass,
          };
        }
      });
  });

  expect(animeInstances).not.toEqual({});

  describe("setLineTensionAnimation", () => {
    it('should seek the "lineTension" and "lineTensionBackground" animations to the value received as parameter', () => {
      setLineTensionAnimation(10);
      expect(animeInstances["#lineTension"].seek).toHaveBeenCalledWith(10);
    });
  });

  describe("setFishDistanceAnimation", () => {
    it("should set fish distance text with two digits and seek distance filling animation", () => {
      setFishDistanceAnimation(10, 20);

      expect(fishDistanceText).toHaveBeenCalledWith("10.00m");
      expect(
        animeInstances["#fishDistanceIndicator"].seek
      ).toHaveBeenCalledWith(20);
    });
  });

  describe("setCastDistanceAnimation", () => {
    it('should seek the "castDistance" animation from the value received as parameter and then set the cast minigame toast Y attribute value from the cast distance indicator CY value', () => {
      castDistanceIndicatorAttr.mockImplementationOnce((attr: string) => {
        if (attr === "cy") {
          return 50;
        }
      });

      setCastDistanceAnimation(30);

      expect(
        animeInstances[".castDistanceIndicator"].seek
      ).toHaveBeenCalledWith(30);
      expect(castMinigameToastAttr).toHaveBeenCalledWith("y", 50);
    });
  });

  describe("setBaitFishDistanceText", () => {
    it('should set the bait distance text with the distance received as parameter and show the "SHORT" toast', () => {
      setBaitFishDistanceText(10);
      expect(baitDistanceText).toHaveBeenCalledWith("10.00m");
    });
  });

  describe("setInitialFishDistanceAnimation", () => {
    it('should show the "SHORT" toast and fade it in', () => {
      setInitialFishDistanceAnimation();
      expect(castMinigameToastText).toHaveBeenCalledWith("SHORT");
      expect(castMinigameToastFadeIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("hideInitialFishDistanceAnimation", () => {
    it("should hide initial fish distance toast", () => {
      hideInitialFishDistanceAnimation();
      expect(castMinigameToastFadeOut).toHaveBeenCalledTimes(1);
    });
  });

  describe("setBaitingAnimation", () => {
    it('should seek the "baiting" animation to the value received as parameter', () => {
      setBaitingAnimation(10);
      expect(animeInstances["#baiting-minigame"].seek).toHaveBeenCalledWith(10);
    });
  });

  describe("stopBaitingAnimation", () => {
    it("should stop shaking the baiting container by removing all shaking css classes", () => {
      stopBaitingAnimation();

      expect(baitingMinigameRemoveClass).toHaveBeenCalledWith("shake-light");
      expect(baitingMinigameRemoveClass).toHaveBeenCalledWith("shake-medium");
      expect(baitingMinigameRemoveClass).toHaveBeenCalledWith("shake-hard");
    });
  });

  describe("setBaitingCatchOpportunityAnimation", () => {
    setBaitingCatchOpportunityAnimation(10);
    expect(
      animeInstances["#catchOpportunityIndicator"].seek
    ).toHaveBeenCalledWith(10);
  });

  describe("runReelingKeyPressAnimation", () => {
    runReelingKeyPressAnimation();
    expect(animeInstances[".reelingKeyPress"].play).toHaveBeenCalledTimes(1);
  });

  describe("animejs line tension animation updates", () => {
    test.each([
      {
        animation: "hard",
        progress: 91,
      },
      {
        animation: "medium",
        progress: 71,
      },
      {
        animation: "light",
        progress: 51,
      },
    ])(
      'should set the reeling container shake animation as "$animation" and remove the two others when the line tension is above $progress',
      ({ animation, progress }) => {
        (animeInstances["#lineTension"] as any).update({
          progress,
        });

        expect(reelingMinigameAddClass).toHaveBeenCalledWith(
          `shake-${animation}`
        );

        expect(reelingMinigameRemoveClass).toHaveBeenCalledTimes(2);

        expect(reelingMinigameRemoveClass).not.toHaveBeenCalledWith(
          `shake-${animation}`
        );
      }
    );

    it("should remove all animations when the line tension is equal or below 50", () => {
      (animeInstances["#lineTension"] as any).update({
        progress: 50,
      });

      (animeInstances["#lineTension"] as any).update({
        progress: 49,
      });

      (animeInstances["#lineTension"] as any).update({
        progress: 0,
      });

      expect(reelingMinigameAddClass).not.toHaveBeenCalled();
      expect(reelingMinigameRemoveClass).toHaveBeenCalledWith("shake-light");
      expect(reelingMinigameRemoveClass).toHaveBeenCalledWith("shake-medium");
      expect(reelingMinigameRemoveClass).toHaveBeenCalledWith("shake-hard");
    });
  });

  describe("animejs baiting animation updates", () => {
    test.each([
      {
        animation: "hard",
        progress: 81,
      },
      {
        animation: "medium",
        progress: 51,
      },
      {
        animation: "light",
        progress: 50,
      },
      {
        animation: "light",
        progress: 1,
      },
    ])(
      'should set the baiting container shake animation as "$animation" and remove the two others when the line tension is above $progress',
      ({ animation, progress }) => {
        (animeInstances["#baiting-minigame"] as any).update({
          progress,
        });

        expect(baitingMinigameAddClass).toHaveBeenCalledWith(
          `shake-${animation}`
        );

        expect(baitingMinigameRemoveClass).toHaveBeenCalledTimes(2);

        expect(baitingMinigameRemoveClass).not.toHaveBeenCalledWith(
          `shake-${animation}`
        );
      }
    );
  });
});
