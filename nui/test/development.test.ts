import { startDevelopmentMode, stopDevelopmentMode } from "../development";
import { hideNui, showNui } from "../dom/containers";

jest.mock("../dom/containers", () => ({
  showNui: jest.fn(),
  hideNui: jest.fn(),
}));

describe("development", () => {
  let bodyCss: jest.Mock;

  beforeEach(() => {
    bodyCss = jest.fn();

    (globalThis as any).$ = jest
      .fn()
      .mockImplementation((container: string) => {
        if (container === "body") {
          return {
            css: bodyCss,
          };
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("startDevelopmentMode", () => {
    it("should show the NUI and set body background color to blue", () => {
      startDevelopmentMode();

      expect(showNui).toHaveBeenCalledTimes(1);
      expect(bodyCss).toHaveBeenCalledTimes(1);
      expect(bodyCss).toHaveBeenCalledWith("background-color", "blue");
    });
  });

  describe("stopDevelopmentMode", () => {
    it("should hide the NUI and set the background color to transparent", () => {
      stopDevelopmentMode();

      expect(hideNui).toHaveBeenCalledTimes(1);
      expect(bodyCss).toHaveBeenCalledTimes(1);
      expect(bodyCss).toHaveBeenCalledWith("background-color", "transparent");
    });

    it("should unbind the keydown and keyup events", () => {
      stopDevelopmentMode();

      expect(hideNui).toHaveBeenCalledTimes(1);
      expect(bodyCss).toHaveBeenCalledTimes(1);
      expect(bodyCss).toHaveBeenCalledWith("background-color", "transparent");
    });
  });
});
