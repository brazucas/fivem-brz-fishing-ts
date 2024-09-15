const eventListener = jest.spyOn(window, "addEventListener");

let eventListenerCb: (event: any) => void;

(eventListener as jest.Mock).mockImplementation(
  (_: any, cb: (event: any) => void) => {
    eventListenerCb = cb;
  }
);

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
} from "../dom/animations";
import {
  hideCatchTooltip,
  hideNui,
  showCatchTooltip,
  showContainer,
  showNui,
} from "../dom/containers";

import "../fishing";

jest.mock("../dom/animations", () => ({
  setLineTensionAnimation: jest.fn(),
  setFishDistanceAnimation: jest.fn(),
  setBaitFishDistanceText: jest.fn(),
  setInitialFishDistanceAnimation: jest.fn(),
  setCastDistanceAnimation: jest.fn(),
  hideInitialFishDistanceAnimation: jest.fn(),
  runReelingKeyPressAnimation: jest.fn(),
  stopBaitingAnimation: jest.fn(),
  setBaitingAnimation: jest.fn(),
  setBaitingCatchOpportunityAnimation: jest.fn(),
}));

jest.mock("../dom/containers", () => ({
  showNui: jest.fn(),
  showContainer: jest.fn(),
  hideCatchTooltip: jest.fn(),
  hideNui: jest.fn(),
  showCatchTooltip: jest.fn(),
  containers: {
    baiting: {
      children: {
        baitingSpot: "#baitingSpot",
        distance: "#distance",
        catchTooltip: ".catchTooltip",
      },
    },
  },
}));

describe("fishing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("event listener", () => {
    describe("action handlers", () => {
      const jQueryCssFn = jest.fn();

      beforeAll(() => {
        (globalThis as any).$ = jest
          .fn()
          .mockImplementation((container: string) => {
            if (container === ".minigame-container") {
              return {
                css: jQueryCssFn,
              };
            }
          });
      });

      test.each([
        {
          test: "should call showNui",
          action: "start-fishing",
          expectedFunctionCalls: [showNui],
        },
        {
          test: "should call hideNui",
          action: "stop-fishing",
          expectedFunctionCalls: [hideNui],
        },
        {
          test: "should call stopBaitingAnimation and showCatchTooltip",
          action: "show-baiting-tooltips",
          expectedFunctionCalls: [stopBaitingAnimation, showCatchTooltip],
        },
        {
          test: "should call hideCatchTooltip",
          action: "hide-baiting-tooltips",
          expectedFunctionCalls: [hideCatchTooltip],
        },
        {
          test: "should call runReelingKeyPressAnimation",
          action: "reeling-key-pressed",
          expectedFunctionCalls: [runReelingKeyPressAnimation],
        },
      ])(
        "$test when the window event listener receives the $action action",
        ({ action, expectedFunctionCalls }) => {
          eventListenerCb({
            data: {
              action,
            },
          });

          expectedFunctionCalls.forEach((fn) => {
            expect(fn).toHaveBeenCalledTimes(1);
          });
        }
      );

      it("should reposition the DOM container .minigame-container according to the received data when center is false", () => {
        eventListenerCb({
          data: {
            action: "fish-2d-position",
            center: false,
            posX: 10,
            posY: 20,
          },
        });

        expect(jQueryCssFn).toHaveBeenCalledTimes(3);
        expect(jQueryCssFn).toHaveBeenNthCalledWith(1, "position", "absolute");
        expect(jQueryCssFn).toHaveBeenNthCalledWith(2, "left", "10px");
        expect(jQueryCssFn).toHaveBeenNthCalledWith(3, "top", "20px");
      });

      it("should set the DOM container .minigame-container position as block when center is true", () => {
        eventListenerCb({
          data: {
            action: "fish-2d-position",
            center: true,
          },
        });

        expect(jQueryCssFn).toHaveBeenCalledTimes(1);
        expect(jQueryCssFn).toHaveBeenCalledWith("position", "block");
      });

      it("should log an error message when the action is unknown", () => {
        const consoleError = jest.spyOn(console, "error");

        eventListenerCb({
          data: {
            action: "unknown-action",
          },
        });

        expect(consoleError).toHaveBeenCalledTimes(1);
        expect(consoleError).toHaveBeenCalledWith(
          "[brz-fishing] Unknown action unknown-action"
        );
      });
    });

    describe("set-state handlers", () => {
      const baitingSpotFadeIn = jest.fn();
      const distanceFadeIn = jest.fn();

      beforeAll(() => {
        (globalThis as any).$ = jest
          .fn()
          .mockImplementation((container: string) => {
            if (container === "#baitingSpot") {
              return {
                fadeIn: baitingSpotFadeIn,
              };
            }

            if (container === "#distance") {
              return {
                fadeIn: distanceFadeIn,
              };
            }
          });
      });

      test.each([
        {
          test: "should call hideNui one time",
          state: "not-fishing",
          expectations: [() => expect(hideNui).toHaveBeenCalledTimes(1)],
        },
        {
          test: "should call showContainer for the 'cast' container",
          state: "casting",
          expectations: [
            () => expect(showContainer).toHaveBeenCalledWith("cast"),
          ],
        },
        {
          test: "should call showContainer for the 'baiting' container",
          state: "baiting",
          expectations: [
            () => expect(showContainer).toHaveBeenCalledWith("baiting"),
          ],
        },
        {
          test: "should fadeIn the baitingSpot and distance children containers",
          state: "baiting",
          expectations: [
            () => expect(baitingSpotFadeIn).toHaveBeenCalledTimes(1),
            () => expect(distanceFadeIn).toHaveBeenCalledTimes(1),
          ],
        },
        {
          test: "should call showContainer for the 'reeling' container",
          state: "reeling",
          expectations: [
            () => expect(showContainer).toHaveBeenCalledWith("reeling"),
          ],
        },
      ])(
        "$test when the window event listener receives the set-state action with the $state state",
        ({ state, expectations }) => {
          eventListenerCb({
            data: {
              action: "set-state",
              state,
            },
          });

          expectations.forEach((expectation) => {
            expectation();
          });
        }
      );
    });

    describe("set-param handlers", () => {
      const baitingSpotFadeOut = jest.fn();
      const distanceFadeOut = jest.fn();

      beforeAll(() => {
        (globalThis as any).$ = jest
          .fn()
          .mockImplementation((container: string) => {
            if (container === "#baitingSpot") {
              return {
                fadeOut: baitingSpotFadeOut,
              };
            }

            if (container === "#distance") {
              return {
                fadeOut: distanceFadeOut,
              };
            }
          });
      });

      test.each([
        {
          test: "should call setLineTensionAnimation passing the value received as parameter",
          param: "lineTension",
          value: 0.5,
          expectations: [
            () => expect(setLineTensionAnimation).toHaveBeenCalledTimes(1),
            () => expect(setLineTensionAnimation).toHaveBeenCalledWith(0.5),
          ],
        },
        {
          test: "should call setCastDistanceAnimation passing the value received as parameter",
          param: "rodCastPercentage",
          value: 30,
          expectations: [
            () => expect(setCastDistanceAnimation).toHaveBeenCalledTimes(1),
            () => expect(setCastDistanceAnimation).toHaveBeenCalledWith(30),
          ],
        },
        {
          test: "should call setBaitingAnimation passing the value received as parameter",
          param: "baitingTime",
          value: 30,
          expectations: [
            () => expect(setBaitingAnimation).toHaveBeenCalledTimes(1),
            () => expect(setBaitingAnimation).toHaveBeenCalledWith(30),
          ],
        },
        {
          test: "should call setBaitingCatchOpportunityAnimation and fadeOut baitingSpot and distance containers",
          param: "catchOpportunityWindow",
          value: 30,
          expectations: [
            () =>
              expect(setBaitingCatchOpportunityAnimation).toHaveBeenCalledTimes(
                1
              ),
            () =>
              expect(setBaitingCatchOpportunityAnimation).toHaveBeenCalledWith(
                30
              ),
            () => expect(baitingSpotFadeOut).toHaveBeenCalledTimes(1),
            () => expect(distanceFadeOut).toHaveBeenCalledTimes(1),
          ],
        },
      ])(
        "$test when the window event listener receives the set-param action with the $param param",
        ({ param, value, expectations }) => {
          eventListenerCb({
            data: {
              action: "set-param",
              param,
              value,
            },
          });

          expectations.forEach((expectation) => {
            expectation();
          });
        }
      );

      it("should set bait visual fish distance text and invoke initial fish fistance animation when distance is higher than 0", () => {
        eventListenerCb({
          data: {
            action: "set-param",
            param: "initialFishDistance",
            value: 10,
          },
        });

        expect(setBaitFishDistanceText).toHaveBeenCalledTimes(1);
        expect(setBaitFishDistanceText).toHaveBeenCalledWith(10);

        expect(setInitialFishDistanceAnimation).toHaveBeenCalledTimes(1);
      });

      it("should hide the initial fish distance animation when the distance is 0", () => {
        eventListenerCb({
          data: {
            action: "set-param",
            param: "initialFishDistance",
            value: 0,
          },
        });

        expect(setBaitFishDistanceText).not.toHaveBeenCalled();
        expect(setInitialFishDistanceAnimation).not.toHaveBeenCalled();

        expect(hideInitialFishDistanceAnimation).toHaveBeenCalledTimes(1);
      });

      it("should set fish distance animation passing the distance received as parameter and calculate the animation percentage using an inverted logic (0 = 100%, 100 = 0%)", () => {
        eventListenerCb({
          data: {
            action: "set-param",
            param: "initialFishDistance",
            value: 20,
          },
        });

        eventListenerCb({
          data: {
            action: "set-param",
            param: "fishDistance",
            value: 10,
          },
        });

        eventListenerCb({
          data: {
            action: "set-param",
            param: "fishDistance",
            value: 5,
          },
        });

        eventListenerCb({
          data: {
            action: "set-param",
            param: "fishDistance",
            value: 20,
          },
        });

        eventListenerCb({
          data: {
            action: "set-param",
            param: "fishDistance",
            value: 0,
          },
        });

        expect(setFishDistanceAnimation).toHaveBeenCalledTimes(4);
        expect(setFishDistanceAnimation).toHaveBeenNthCalledWith(1, 10, 50);
        expect(setFishDistanceAnimation).toHaveBeenNthCalledWith(2, 5, 75);
        expect(setFishDistanceAnimation).toHaveBeenNthCalledWith(3, 20, 0);
        expect(setFishDistanceAnimation).toHaveBeenNthCalledWith(4, 0, 100);
      });
    });
  });
});
