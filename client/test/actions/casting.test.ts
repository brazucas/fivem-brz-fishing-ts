import { startCasting, stopCasting } from "@/actions/casting";
import { performCastingAnimations } from "@/animations";
import { useBait } from "@/fishing";
import { getFishingSpot } from "@/helpers/fishing.helper";
import { setFishingParam, setState } from "@/state";
import { notify } from "@core/thirdparties.service";
import { Delay } from "@helpers";

global.setTick = jest.fn();
global.clearTick = jest.fn();
global.IsControlJustPressed = jest.fn();
global.PlayerPedId = jest.fn();
global.GetDistanceBetweenCoords = jest.fn();
global.GetEntityCoords = jest.fn().mockReturnValue([0, 0, 0]);

jest.useFakeTimers();

jest.mock("@helpers", () => ({
  Delay: jest.fn(),
}));

jest.mock("@core/thirdparties.service", () => ({
  notify: jest.fn(),
}));

jest.mock("@config/locales", () => ({
  t: jest.fn().mockImplementation((phase: string) => phase),
}));

jest.mock("@/state", () => ({
  setFishingParam: jest.fn(),
  setState: jest.fn(),
}));

jest.mock("@/helpers/fishing.helper", () => ({
  getFishingSpot: jest.fn().mockResolvedValue([0, 0, 0]),
}));

jest.mock("@/fishing", () => ({
  useBait: jest.fn(),
}));

jest.mock("@/animations", () => ({
  performCastingAnimations: jest.fn(),
}));

describe("casting action", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe("startCasting", () => {
    it("should set a 10ms interval for updating the rodCastPercentage fishing parameter with an increment of 1", () => {
      startCasting();

      jest.advanceTimersByTime(9);

      expect(setFishingParam).not.toHaveBeenCalledWith(
        "rodCastPercentage",
        expect.anything()
      );

      jest.advanceTimersByTime(1);

      expect(setFishingParam).toHaveBeenCalledWith("rodCastPercentage", 1);

      jest.advanceTimersByTime(20);

      expect(setFishingParam).toHaveBeenCalledWith("rodCastPercentage", 2);
      expect(setFishingParam).toHaveBeenCalledWith("rodCastPercentage", 3);
    });

    it("should set a 5s timeout to notify the player that the casting took too long and set state to not-fishing", () => {
      startCasting();

      jest.advanceTimersByTime(4999);

      expect(notify).not.toHaveBeenCalledWith(
        "rod_cast_took_too_long",
        "error"
      );
      expect(setState).not.toHaveBeenCalledWith("not-fishing");

      jest.advanceTimersByTime(1);

      expect(notify).toHaveBeenCalledWith("rod_cast_took_too_long", "error");
      expect(setState).toHaveBeenCalledWith("not-fishing");
    });

    describe("lock indicator tick", () => {
      it("should set fivem tick to lock indicator when control 46 [E] is pressed", async () => {
        startCasting();

        (IsControlJustPressed as jest.Mock).mockReturnValueOnce(false);

        expect(global.setTick).toHaveBeenCalledWith(expect.any(Function));

        const tickFunction = (global.setTick as jest.Mock).mock.calls[0][0];

        await tickFunction();

        expect(IsControlJustPressed).toHaveBeenCalledTimes(1);
      });

      describe("when control 46 [E] is pressed", () => {
        let tickFunction: Function;

        beforeEach(async () => {
          (setTick as jest.Mock).mockReturnValueOnce(1);

          startCasting();

          (IsControlJustPressed as jest.Mock).mockReturnValueOnce(true);

          tickFunction = (global.setTick as jest.Mock).mock.calls[0][0];
        });

        it("should clear the casting timeout", async () => {
          const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

          await tickFunction();

          expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

          clearTimeoutSpy.mockRestore();
        });

        it("should notify the player that the fishing spot was not found if getFishingSpot returns null", async () => {
          (getFishingSpot as jest.Mock).mockResolvedValueOnce(null);

          await tickFunction();

          expect(notify).toHaveBeenCalledWith(
            "fishing_spot_not_found",
            "error"
          );
        });

        describe("when getFishingSpot returns a value", () => {
          beforeEach(() => {
            (getFishingSpot as jest.Mock).mockResolvedValueOnce([0, 0, 0]);
          });

          it("should use bait", async () => {
            await tickFunction();

            expect(useBait).toHaveBeenCalledTimes(1);
          });

          it("should clear the indicator interval and fivem lock indicator tick", async () => {
            const clearIntervalSpy = jest.spyOn(global, "clearInterval");

            await tickFunction();

            expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
            expect(clearTick).toHaveBeenCalledTimes(1);

            clearIntervalSpy.mockRestore();
          });

          it("should perform casting animations", async () => {
            await tickFunction();

            expect(performCastingAnimations).toHaveBeenCalledTimes(1);
          });

          it("should set the rodCastPercentage ", async () => {
            await tickFunction();

            expect(setFishingParam).toHaveBeenCalledWith(
              "rodCastPercentage",
              expect.any(Number)
            );
          });

          it("should set the fishDistance and initialFishDistance from the distance between fishing spot and player", async () => {
            const fishDistance = 100;
            const playerPedId = 1;

            (GetDistanceBetweenCoords as jest.Mock).mockReturnValueOnce(
              fishDistance
            );

            (PlayerPedId as jest.Mock).mockReturnValue(playerPedId);

            await tickFunction();

            expect(GetEntityCoords).toHaveBeenCalledTimes(3);
            expect(GetEntityCoords).toHaveBeenCalledWith(playerPedId, true);

            expect(setFishingParam).toHaveBeenCalledWith(
              "fishDistance",
              fishDistance
            );

            expect(setFishingParam).toHaveBeenCalledWith(
              "initialFishDistance",
              fishDistance
            );
          });

          it("should delay 2s and set state to baiting", async () => {
            await tickFunction();

            expect(Delay).toHaveBeenCalledWith(2000);
            expect(setState).toHaveBeenCalledWith("baiting");
          });
        });
      });
    });
  });

  describe("stopCasting", () => {
    it("should clear the casting interval and lock indicator tick", () => {
      const clearIntervalSpy = jest.spyOn(global, "clearInterval");
      jest.spyOn(global, "setInterval").mockReturnValueOnce(1 as any);
      (setTick as jest.Mock).mockReturnValueOnce(1);

      startCasting();

      stopCasting();

      expect(clearIntervalSpy).toHaveBeenCalledWith(1);
      expect(clearTick).toHaveBeenCalledWith(1);
    });
  });
});
