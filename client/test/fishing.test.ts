import {
  runCaughtFishAnimation,
  stopCastingAnimations,
  stopFishingAnimation,
} from "@/animations";
import {
  catchFish,
  requestStartFishing,
  startFishing,
  stopFishing,
  useBait,
} from "@/fishing";
import { getFishingSpot } from "@/helpers/fishing.helper";
import {
  getFishingParam,
  getState,
  resetFishingParams,
  setFishingParam,
  setState,
} from "@/state";
import { emitNetTyped } from "@core/helpers/cfx";
import { hasItem } from "@core/inventory";
import { notify } from "@core/notification";

global.GetPlayerPed = jest.fn().mockReturnValue(1);
global.GetEntityCoords = jest.fn().mockReturnValue([0, 0, 0]);
global.IsPedInAnyVehicle = jest.fn().mockReturnValue(false);
global.FreezeEntityPosition = jest.fn();
global.GetEntityForwardVector = jest.fn().mockReturnValue([0, 0, 0]);
global.TestProbeAgainstWater = jest.fn().mockReturnValue([1, 1]);
global.PlayerPedId = jest.fn().mockReturnValue(1);
global.SetNuiFocus = jest.fn();
global.TaskStartScenarioInPlace = jest.fn();
global.SendNUIMessage = jest.fn();
global.GetPlayerServerId = jest.fn();
global.PlayerId = jest.fn();

jest.mock("../state", () => ({
  getState: jest.fn(),
  resetFishingParams: jest.fn(),
  setFishingParam: jest.fn(),
  setState: jest.fn(),
  getFishingParam: jest.fn(),
}));

jest.mock("@config/locales", () => ({
  t: jest.fn().mockImplementation((phase: string) => phase),
}));

jest.mock("@core/notification", () => ({
  notify: jest.fn(),
}));

jest.mock("@core/inventory", () => ({
  hasItem: jest.fn(),
}));

jest.mock("../helpers/fishing.helper", () => ({
  getFishingSpot: jest.fn(),
}));

jest.mock("@core/helpers/cfx", () => ({
  emitNetTyped: jest.fn(),
}));

jest.mock("../animations", () => ({
  stopCastingAnimations: jest.fn(),
  stopFishingAnimation: jest.fn(),
  runCaughtFishAnimation: jest.fn(),
}));

describe("Main fishing logic", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("startFishing", () => {
    const hasItemImplementationMock =
      (rodReturnValue = true, baitReturnValue = true) =>
      () =>
        (hasItem as jest.Mock).mockImplementation((item: string) => {
          if (item === "fishingrod1") return rodReturnValue;
          if (item === "commonbait") return baitReturnValue;
          return false;
        });

    const mockFunctions = {
      alreadyFishing:
        (returnValue = "not-fishing") =>
        () =>
          (getState as jest.Mock).mockReturnValue(returnValue),
      inVehicle:
        (returnValue = false) =>
        () =>
          (IsPedInAnyVehicle as jest.Mock).mockReturnValue(returnValue),
      hasRod: hasItemImplementationMock,
      hasBait: hasItemImplementationMock,
      inFishingSpot:
        (returnValue: number[] | null = [0, 0]) =>
        () =>
          (getFishingSpot as jest.Mock).mockReturnValue(returnValue),
    };

    beforeEach(() => {
      Object.values(mockFunctions).forEach((mockFn) => mockFn()());
    });

    describe("when player can start fishing", () => {
      test.each([
        {
          test: "player is already fishing",
          mockFn: mockFunctions.alreadyFishing("fishing"),
          expectedError: "already_fishing_error",
        },
        {
          test: "player is in a vehicle",
          mockFn: mockFunctions.inVehicle(true),
          expectedError: "in_vehicle_error",
        },
        {
          test: "player doesn't have a rod",
          mockFn: mockFunctions.hasRod(false),
          expectedError: "has_rod_error",
        },
        {
          test: "player doesn't have bait",
          mockFn: mockFunctions.hasBait(true, false),
          expectedError: "has_bait_error",
        },
        {
          test: "player is not in a fishing spot",
          mockFn: mockFunctions.inFishingSpot(null),
          expectedError: "fishing_spot_error",
        },
      ])(
        "should notify an $expectedError error when $test",
        async ({ mockFn, expectedError }) => {
          mockFn();

          await startFishing(1, "fish");

          expect(notify).toHaveBeenCalledWith(expectedError, "error");
        }
      );
    });

    it("should reset fishing params when start fishing", async () => {
      await startFishing(1, "fish");

      expect(resetFishingParams).toHaveBeenCalledTimes(1);
    });

    it("should set the fishing param from the fish id received by parameter", async () => {
      await startFishing(1, "fish");

      expect(setFishingParam).toHaveBeenCalledTimes(1);
      expect(setFishingParam).toHaveBeenCalledWith("fishId", "fish");
    });

    it("should set nui focus and cursor to false", async () => {
      await startFishing(1, "fish");

      expect(SetNuiFocus).toHaveBeenCalledTimes(1);
      expect(SetNuiFocus).toHaveBeenCalledWith(false, false);
    });

    it("should start the WORLD_HUMAN_STAND_FISHING animation with the enter anim param as true", async () => {
      await startFishing(1, "fish");

      expect(TaskStartScenarioInPlace).toHaveBeenCalledTimes(1);
      expect(TaskStartScenarioInPlace).toHaveBeenCalledWith(
        expect.anything(),
        "WORLD_HUMAN_STAND_FISHING",
        expect.anything(),
        true
      );
    });

    it("should send the start-fishing action over to the NUI", async () => {
      await startFishing(1, "fish");

      expect(SendNUIMessage).toHaveBeenCalledTimes(1);
      expect(SendNUIMessage).toHaveBeenCalledWith({ action: "start-fishing" });
    });

    it("should set the script state as casting and send a success notification", async () => {
      await startFishing(1, "fish");

      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith("casting");
      expect(notify).toHaveBeenCalledWith("fishing_state", "success");
    });
  });

  describe("requestStartFishing", () => {
    it("should emit the requestStartFishing event with the player server id", async () => {
      (GetPlayerServerId as jest.Mock).mockReturnValue(9);

      await requestStartFishing();

      expect(GetPlayerServerId).toHaveBeenCalledTimes(1);
      expect(PlayerId).toHaveBeenCalledTimes(1);
      expect(emitNetTyped).toHaveBeenCalledWith(
        "brz-fishing:requestStartFishing",
        9
      );
    });
  });

  describe("stopFishing", () => {
    it("should set the NUI focus and cursor to false", () => {
      stopFishing();

      expect(SetNuiFocus).toHaveBeenCalledTimes(1);
      expect(SetNuiFocus).toHaveBeenCalledWith(false, false);
    });

    it("should send the stop-fishing action over to the NUI", () => {
      stopFishing();

      expect(SendNUIMessage).toHaveBeenCalledTimes(1);
      expect(SendNUIMessage).toHaveBeenCalledWith({ action: "stop-fishing" });
    });

    it("should stop the fishing and casting animations and reset the fishing params", () => {
      stopFishing();

      expect(stopFishingAnimation).toHaveBeenCalledTimes(1);
      expect(stopCastingAnimations).toHaveBeenCalledTimes(1);
      expect(resetFishingParams).toHaveBeenCalledTimes(1);
    });
  });

  describe("useBait", () => {
    it("should emit the useBait event with the player server id", () => {
      (GetPlayerServerId as jest.Mock).mockReturnValue(9);

      useBait();

      expect(GetPlayerServerId).toHaveBeenCalledTimes(1);
      expect(PlayerId).toHaveBeenCalledTimes(1);
      expect(emitNetTyped).toHaveBeenCalledWith("brz-fishing:useBait", 9);
    });
  });

  describe("catchFish", () => {
    it("should run the caught fish animation with the fish id from the fishing params", () => {
      (getFishingParam as jest.Mock).mockReturnValue("fish");

      catchFish();

      expect(runCaughtFishAnimation).toHaveBeenCalledTimes(1);
      expect(runCaughtFishAnimation).toHaveBeenCalledWith("fish");
    });

    it("should emit the catchFish event with the player server id", () => {
      (GetPlayerServerId as jest.Mock).mockReturnValue(9);

      catchFish();

      expect(GetPlayerServerId).toHaveBeenCalledTimes(1);
      expect(PlayerId).toHaveBeenCalledTimes(1);
      expect(emitNetTyped).toHaveBeenCalledWith("brz-fishing:catchFish", 9);
    });
  });
});
