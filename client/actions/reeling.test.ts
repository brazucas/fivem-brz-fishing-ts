import { startReeling, stopReeling } from "@/actions/reeling";
import { getFishPed } from "@/animations";
import { catchFish } from "@/fishing";
import { getFishingParam, setFishingParam } from "@/state";
import { notify } from "@core/notification";

jest.useFakeTimers();

global.IsControlJustPressed = jest.fn();
global.SendNUIMessage = jest.fn();
global.IsEntityInWater = jest.fn();
global.StopRopeWinding = jest.fn();
global.StartRopeUnwindingFront = jest.fn();
global.StopRopeUnwindingFront = jest.fn();
global.StartRopeWinding = jest.fn();
global.RopeForceLength = jest.fn();
global.GetEntityCoords = jest.fn();
global.GetScreenCoordFromWorldCoord = jest.fn();
global.GetActiveScreenResolution = jest.fn();
global.setTick = jest.fn();
global.clearTick = jest.fn();
global.ShakeGameplayCam = jest.fn();

jest.mock("@/fishing", () => ({
  catchFish: jest.fn(),
}));

jest.mock("@/state", () => ({
  getFishingParam: jest.fn(),
  setFishingParam: jest.fn(),
  setState: jest.fn(),
}));

jest.mock("@core/notification", () => ({
  notify: jest.fn(),
}));

jest.mock("@config/locales", () => ({
  t: jest.fn().mockImplementation((phase: string) => phase),
}));

jest.mock("@/animations", () => ({
  getFishPed: jest.fn(),
  getFishRope: jest.fn(),
}));

jest.mock("@config/config", () => ({
  fishingLimits: {
    tensionRecoverRate: 5,
    maximumLineTension: 100,
    lineTensionIncreaseRate: 5,
  },
}));

describe("reeling action", () => {
  describe("startReeling", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should set a fivem tick for detecting when the control 46 [E] is pressed", async () => {
      startReeling();

      expect(global.setTick).toHaveBeenCalled();

      const tickFunction = (global.setTick as jest.Mock).mock.calls[0][0];

      await tickFunction();

      expect(IsControlJustPressed).toHaveBeenCalledWith(0, 46);
    });

    describe("when the control 46 [E] is pressed", () => {
      let tickFunction: Function;

      beforeEach(async () => {
        startReeling();
        tickFunction = (global.setTick as jest.Mock).mock.calls[0][0];

        (IsControlJustPressed as jest.Mock).mockReturnValue(true);
      });

      afterAll(() => {
        (IsControlJustPressed as jest.Mock).mockReset();
      });

      it("should send a eeling-key-pressed NUI action", async () => {
        await tickFunction();

        expect(SendNUIMessage).toHaveBeenCalledWith({
          action: "reeling-key-pressed",
        });
      });

      describe("line tension update", () => {
        beforeEach(() => {
          (ShakeGameplayCam as jest.Mock).mockClear();
        });

        it("should update the line tension fishing parameter on every key press by summing the base line tension, current line tension and new tension constant of 16", async () => {
          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "baseLineTension") {
              return 10;
            }

            if (param === "lineTension") {
              return 10;
            }

            return 0;
          });

          await tickFunction();

          expect(setFishingParam).toHaveBeenCalledWith("lineTension", 36);
        });

        it("should set the line tension to 100 if the sum of the base line tension, current line tension and new tension constant of 16 is greater than 100", async () => {
          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "baseLineTension") {
              return 10;
            }

            if (param === "lineTension") {
              return 100;
            }

            return 0;
          });

          await tickFunction();

          expect(setFishingParam).toHaveBeenCalledWith("lineTension", 100);
        });

        it("should call the ShakeGameplayCam native with LARGE_EXPLOSION_SHAKE when the new tension is greater or equal than 80", async () => {
          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "baseLineTension") {
              return 10;
            }

            if (param === "lineTension") {
              return 53;
            }

            return 0;
          });

          await tickFunction();

          expect(ShakeGameplayCam).not.toHaveBeenCalledWith(
            "LARGE_EXPLOSION_SHAKE",
            0.05
          );

          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "baseLineTension") {
              return 10;
            }

            if (param === "lineTension") {
              return 54;
            }

            return 0;
          });

          await tickFunction();

          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "baseLineTension") {
              return 10;
            }

            if (param === "lineTension") {
              return 55;
            }

            return 0;
          });

          await tickFunction();

          expect(ShakeGameplayCam).toHaveBeenCalledTimes(2);
          expect(ShakeGameplayCam).toHaveBeenCalledWith(
            "LARGE_EXPLOSION_SHAKE",
            0.05
          );
        });

        it("should notify the player with the pull_too_hard message and set the state to not-fishing if the line tension is greater or equal than 100", async () => {
          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "baseLineTension") {
              return 0;
            }

            if (param === "lineTension") {
              return 83;
            }

            return 0;
          });

          await tickFunction();

          expect(notify).not.toHaveBeenCalledWith("pull_too_hard", "error");
          expect(setFishingParam).not.toHaveBeenCalledWith("lineTension", 100);

          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "baseLineTension") {
              return 0;
            }

            if (param === "lineTension") {
              return 84;
            }

            return 0;
          });

          await tickFunction();

          expect(notify).toHaveBeenCalledWith("pull_too_hard", "error");
          expect(setFishingParam).toHaveBeenCalledWith("lineTension", 100);
        });
      });

      describe("reel fish tick", () => {
        it("should update the fish distance fishing parameter on every key press by subtracting the fish distance by 2", async () => {
          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "fishDistance") {
              return 10;
            }

            return 0;
          });

          await tickFunction();

          expect(setFishingParam).toHaveBeenCalledWith("fishDistance", 8);
        });

        it("should call the fish-2d-position NUI action with center set to false if the fish ped world position can be translated to the screen position based on the screen resolution", async () => {
          (GetScreenCoordFromWorldCoord as jest.Mock).mockReturnValue([
            1, 0.5, 0.5,
          ]);

          (getFishPed as jest.Mock).mockReturnValueOnce(1);

          (GetEntityCoords as jest.Mock).mockImplementationOnce(
            (ped: number) => {
              if (ped === 1) {
                return [0, 0, 0];
              }

              return;
            }
          );

          (GetActiveScreenResolution as jest.Mock).mockReturnValue([
            1920, 1080,
          ]);

          await tickFunction();

          expect(SendNUIMessage).toHaveBeenCalledWith({
            action: "fish-2d-position",
            center: false,
            posX: 960,
            posY: 540,
          });
        });

        it("should call the fish-2d-position NUI action with center set to true if the fish ped world position can't be translated to the screen position based on the screen resolution", async () => {
          (GetScreenCoordFromWorldCoord as jest.Mock).mockReturnValue([
            0, 0, 0,
          ]);

          (getFishPed as jest.Mock).mockReturnValueOnce(1);

          (GetEntityCoords as jest.Mock).mockImplementationOnce(
            (ped: number) => {
              if (ped === 1) {
                return [0, 0, 0];
              }

              return;
            }
          );

          await tickFunction();

          expect(SendNUIMessage).toHaveBeenCalledWith({
            action: "fish-2d-position",
            center: true,
          });
        });

        it("should call the catchFish action if the fish distance is less or equal than 0", async () => {
          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "fishDistance") {
              return 0;
            }

            return 0;
          });

          await tickFunction();

          expect(catchFish).toHaveBeenCalled();
        });
      });
    });

    describe("reeling release tick", () => {
      describe("release line tension", () => {
        beforeEach(() => {
          jest.clearAllTimers();
        });

        it("should update the line tension decreasing by 5 units every 20ms", () => {
          (getFishingParam as jest.Mock).mockImplementation((param) => {
            if (param === "lineTension") {
              return 100;
            }

            if (param === "fishDistance") {
              return 1;
            }

            return 0;
          });

          startReeling();

          jest.advanceTimersByTime(19);
          expect(setFishingParam).not.toHaveBeenCalledWith("lineTension", 95);
          jest.advanceTimersByTime(1);
          expect(setFishingParam).toHaveBeenCalledWith("lineTension", 95);
        });
      });
    });
  });
});
