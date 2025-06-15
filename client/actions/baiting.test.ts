import { startBaiting, stopBaiting } from "@/actions/baiting";
import { getFishingParam, setState } from "@/state";
import { notify } from "@brz-fivem-sdk/client/notification";

global.SendNUIMessage = jest.fn();
global.IsControlJustPressed = jest.fn();
global.setTick = jest.fn();
global.clearTick = jest.fn();

jest.mock("@brz-fivem-sdk/client/notification", () => ({
  notify: jest.fn(),
}));

jest.mock("@config/locales", () => ({
  t: jest.fn().mockImplementation((key) => key),
}));

jest.mock("@/state", () => ({
  getFishingParam: jest.fn(),
  setFishingParam: jest.fn(),
  setState: jest.fn(),
}));

describe("baiting action", () => {
  let setIntervalSpy: jest.SpyInstance;
  let clearIntervalSpy: jest.SpyInstance;

  beforeAll(() => {
    setIntervalSpy = jest
      .spyOn(global, "setInterval")
      .mockImplementation(() => {
        return 0 as any;
      });

    clearIntervalSpy = jest
      .spyOn(global, "clearInterval")
      .mockImplementation(() => {
        return;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("startBaiting", () => {
    it("should create a nodejs tick interval to run every 20ms to check for the baiting status", () => {
      startBaiting();
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 20);
    });

    describe("Detect control 46 ([E] key) pressed too soon", () => {
      it("should create a fivem tick interval to check whether the control key was just pressed", async () => {
        let tickCallback = jest.fn();

        (setTick as jest.Mock).mockImplementationOnce((callback) => {
          tickCallback = callback;
        });

        startBaiting();

        await tickCallback();

        expect(setTick).toHaveBeenCalledTimes(1);
        expect(IsControlJustPressed).toHaveBeenCalledWith(0, 46);
      });

      it("should notify with fish_pull_too_soon error and set state to not-fishing when the control key was just pressed", async () => {
        let tickCallback = jest.fn();

        (setTick as jest.Mock).mockImplementationOnce((callback) => {
          tickCallback = callback;
        });

        (IsControlJustPressed as jest.Mock).mockReturnValueOnce(true);

        startBaiting();

        await tickCallback();

        expect(notify).toHaveBeenCalledWith("fish_pull_too_soon", "error");
        expect(setState).toHaveBeenCalledWith("not-fishing");
      });
    });

    describe("baiting status tick", () => {
      it("should clear the baiting tick interval and notify with fish_bite_bait success at the 100th or higher baiting tick iteration", async () => {
        let baitingTickCallback = jest.fn();

        const baitingTickSetIntervalValue = 5;

        setIntervalSpy.mockImplementationOnce((callback) => {
          baitingTickCallback = callback;
          return baitingTickSetIntervalValue as any;
        });

        (getFishingParam as jest.Mock).mockReturnValueOnce(99);
        (getFishingParam as jest.Mock).mockReturnValueOnce(100);
        (getFishingParam as jest.Mock).mockReturnValueOnce(101);

        startBaiting();

        await baitingTickCallback();
        await baitingTickCallback();
        await baitingTickCallback();

        expect(clearIntervalSpy).toHaveBeenCalledWith(
          baitingTickSetIntervalValue
        );
        expect(notify).toHaveBeenCalledTimes(2);
        expect(notify).toHaveBeenCalledWith("fish_bite_bait", "success");
      });

      describe("startBaitingOpportunity triggers", () => {
        const setTickValue = 99;

        beforeEach(async () => {
          let baitingTickCallback = jest.fn();

          setIntervalSpy.mockImplementationOnce((callback) => {
            baitingTickCallback = callback;
            return 0 as any;
          });

          (getFishingParam as jest.Mock).mockReturnValueOnce(100);

          (setTick as jest.Mock).mockImplementationOnce(() => setTickValue);

          startBaiting();

          await baitingTickCallback();
        });

        it("should clear the detect fish pull tick", () => {
          expect(clearTick).toHaveBeenCalledTimes(1);
          expect(clearTick).toHaveBeenCalledWith(setTickValue);
        });

        it("should send the show-baiting-tooltips nui action", () => {
          expect(SendNUIMessage).toHaveBeenCalledTimes(1);
          expect(SendNUIMessage).toHaveBeenCalledWith({
            action: "show-baiting-tooltips",
          });
        });

        it("should start a new nodejs interval to check for the bait opportunity minigame status every 10ms", () => {
          expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 10);
        });

        it("should create a fivem tick interval to check whether the control key was just pressed", async () => {
          expect(setTick).toHaveBeenCalledTimes(2);
        });
      });

      describe("startBaitingOpportunity catch tick", () => {
        it("should send the hide-baiting-tooltips nui action, clear the baiting opportunity tick interval and stop the baiting opportunity tick interval at the 100th tick iteration", async () => {
          let baitingTickCallback = jest.fn();
          let baitingOpportunityTickCallback = jest.fn();
          let detectBaitCatchTickCallback = jest.fn();

          const baitingOpportunityTickSetIntervalValue = 10;

          setIntervalSpy.mockImplementationOnce((callback) => {
            baitingTickCallback = callback;
            return 0 as any;
          });

          setIntervalSpy.mockImplementationOnce((callback) => {
            baitingOpportunityTickCallback = callback;
            return baitingOpportunityTickSetIntervalValue as any;
          });

          (getFishingParam as jest.Mock).mockImplementationOnce(
            (param: string) => {
              if (param === "baitingTime") {
                return 100;
              }

              return 0;
            }
          );

          (getFishingParam as jest.Mock).mockImplementationOnce(
            (param: string) => {
              if (param === "catchOpportunityWindow") {
                return 100;
              }

              return 0;
            }
          );

          (setTick as jest.Mock).mockImplementationOnce(() => 1);

          (setTick as jest.Mock).mockImplementationOnce((callback) => {
            detectBaitCatchTickCallback = callback;
            return 0;
          });

          (IsControlJustPressed as jest.Mock).mockReturnValueOnce(true);

          startBaiting();

          await baitingTickCallback();
          await baitingOpportunityTickCallback();
          await detectBaitCatchTickCallback();

          expect(SendNUIMessage).toHaveBeenCalledWith({
            action: "hide-baiting-tooltips",
          });

          expect(clearIntervalSpy).toHaveBeenCalledWith(
            baitingOpportunityTickSetIntervalValue
          );
          expect(clearTick).toHaveBeenCalledTimes(1);
        });

        it("should clear the baiting opportunity tick interval, notify with fish_ran_away error and set the fishing state to not-fishing at the 100th tick iteration", async () => {
          let baitingTickCallback = jest.fn();
          let baitingOpportunityTickCallback = jest.fn();

          const baitingTickSetIntervalValue = 5;
          const baitingOpportunityTickSetIntervalValue = 10;

          setIntervalSpy.mockImplementationOnce((callback) => {
            baitingTickCallback = callback;
            return baitingTickSetIntervalValue as any;
          });

          setIntervalSpy.mockImplementationOnce((callback) => {
            baitingOpportunityTickCallback = callback;
            return baitingOpportunityTickSetIntervalValue as any;
          });

          (getFishingParam as jest.Mock).mockImplementationOnce(
            (param: string) => {
              if (param === "baitingTime") {
                return 100;
              }

              return 0;
            }
          );

          (getFishingParam as jest.Mock).mockImplementationOnce(
            (param: string) => {
              if (param === "catchOpportunityWindow") {
                return 99;
              }

              return 0;
            }
          );

          (getFishingParam as jest.Mock).mockImplementationOnce(
            (param: string) => {
              if (param === "catchOpportunityWindow") {
                return 100;
              }

              return 0;
            }
          );

          startBaiting();

          await baitingTickCallback();
          await baitingOpportunityTickCallback();
          await baitingOpportunityTickCallback();

          expect(clearIntervalSpy).toHaveBeenCalledWith(
            baitingOpportunityTickSetIntervalValue
          );
          expect(setState).toHaveBeenCalledWith("not-fishing");
          expect(notify).toHaveBeenCalledWith("fish_ran_away", "error");
        });
      });
    });
  });

  describe("stopBaiting", () => {
    it("should clear the detect fish pull tick and the baiting tick interval", async () => {
      let baitingTickCallback = jest.fn();
      let baitingOpportunityTickCallback = jest.fn();

      const baitingTickSetIntervalValue = 1;
      const baitingOpportunityTickSetIntervalValue = 2;
      const detectFishPullTick = 3;
      const detectBaitCatchTick = 4;

      setIntervalSpy.mockImplementationOnce((callback) => {
        baitingTickCallback = callback;
        return baitingTickSetIntervalValue as any;
      });

      setIntervalSpy.mockImplementationOnce((callback) => {
        baitingOpportunityTickCallback = callback;
        return baitingOpportunityTickSetIntervalValue as any;
      });

      (setTick as jest.Mock).mockImplementationOnce(() => detectFishPullTick);

      (setTick as jest.Mock).mockImplementationOnce(() => detectBaitCatchTick);

      (getFishingParam as jest.Mock).mockImplementationOnce((param: string) => {
        if (param === "baitingTime") {
          return 100;
        }

        return 0;
      });

      (getFishingParam as jest.Mock).mockImplementationOnce((param: string) => {
        if (param === "catchOpportunityWindow") {
          return 100;
        }

        return 0;
      });

      startBaiting();

      await baitingTickCallback();
      await baitingOpportunityTickCallback();

      stopBaiting();

      expect(clearTick).toHaveBeenNthCalledWith(2, detectBaitCatchTick);

      expect(clearTick).toHaveBeenNthCalledWith(3, detectFishPullTick);

      expect(clearIntervalSpy).toHaveBeenCalledWith(
        baitingTickSetIntervalValue
      );
      expect(clearIntervalSpy).toHaveBeenCalledWith(
        baitingOpportunityTickSetIntervalValue
      );
    });
  });
});
