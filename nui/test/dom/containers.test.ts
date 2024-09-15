import {
  hideCatchTooltip,
  hideNui,
  showCatchTooltip,
  showContainer,
  showNui,
} from "../../dom/containers";

describe("containers", () => {
  const bodyCss = jest.fn();
  const minigameContainerCss = jest.fn();
  const baitingMinigameContaienrCss = jest.fn();
  const baitingMinigameCss = jest.fn();
  const baitingMinigameFadeIn = jest.fn();
  const castMinigameHide = jest.fn();
  const baitingMinigameHide = jest.fn();
  const reelingMinigameHide = jest.fn();
  const catchTooltipFadeIn = jest.fn();
  const catchTooltipFadeOut = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    (globalThis as any).$ = jest
      .fn()
      .mockImplementation((container: string) => {
        if (container === "body") {
          return {
            css: bodyCss,
          };
        }

        if (container === ".minigame-container") {
          return {
            css: minigameContainerCss,
          };
        }

        if (container === "#baiting-minigame") {
          return {
            css: baitingMinigameCss,
            fadeIn: baitingMinigameFadeIn,
            hide: baitingMinigameHide,
          };
        }

        if (container === "#cast-minigame") {
          return {
            hide: castMinigameHide,
          };
        }

        if (container === "#reeling-minigame") {
          return {
            hide: reelingMinigameHide,
          };
        }

        if (container === ".catchTooltip") {
          return {
            fadeIn: catchTooltipFadeIn,
            fadeOut: catchTooltipFadeOut,
          };
        }

        if (container === "#baiting-minigame.minigame-container") {
          return {
            css: baitingMinigameContaienrCss,
          };
        }
      });
  });

  describe("hideNui", () => {
    it("should set body opacity to 0", () => {
      hideNui();

      expect(bodyCss).toBeCalledWith("opacity", 0);
    });
  });

  describe("showNui", () => {
    it("should set minigame container position to block and body opacity to 1", () => {
      showNui();

      expect(minigameContainerCss).toBeCalledWith("position", "block");
      expect(bodyCss).toBeCalledWith("opacity", 1);
    });
  });

  describe("showContainer", () => {
    it("should hide all containers and fade in in 200ms the baiting container", () => {
      showContainer("baiting");

      expect(castMinigameHide).toBeCalled();
      expect(baitingMinigameHide).toBeCalled();
      expect(reelingMinigameHide).toBeCalled();

      expect(baitingMinigameCss).toBeCalledWith("opacity", 1);
      expect(baitingMinigameContaienrCss).toBeCalledWith("opacity", 1);
      expect(baitingMinigameFadeIn).toBeCalledWith({ duration: 200 });
    });
  });

  describe("showCatchTooltip", () => {
    it("should fade in the catch tooltip", () => {
      showCatchTooltip();
      expect(catchTooltipFadeIn).toBeCalled();
    });
  });

  describe("hideCatchTooltip", () => {
    it("should fade out the catch tooltip", () => {
      hideCatchTooltip();
      expect(catchTooltipFadeOut).toBeCalled();
    });
  });
});
