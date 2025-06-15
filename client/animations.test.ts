import {
  getFishPed,
  getFishRope,
  performCastingAnimations,
  runCaughtFishAnimation,
  stopCastingAnimations,
  stopFishingAnimation,
} from "@/animations";
import { getFishingSpot } from "@/helpers/fishing.helper";
import { Fish } from "@common/types";
import { fishes } from "@config/config";
import { createPed, playAnim } from "@brz-fivem-sdk/client/helpers/streaming";
import { Delay } from "@brz-fivem-sdk/common/helpers";

global.GetEntityHeading = jest.fn();
global.SetPedDiesWhenInjured = jest.fn();
global.SetEntityInvincible = jest.fn();
global.PlayerPedId = jest.fn().mockReturnValue(5);
global.GetEntityCoords = jest.fn();
global.ModifyWater = jest.fn();
global.GetOffsetFromEntityInWorldCoords = jest.fn();
global.ApplyForceToEntity = jest.fn();
global.DeletePed = jest.fn();
global.ClearPedTasks = jest.fn();
global.GetClosestObjectOfType = jest.fn();
global.GetHashKey = jest.fn().mockImplementation((hash: string) => hash);
global.SetEntityAsMissionEntity = jest.fn();
global.DeleteEntity = jest.fn();
global.SetEntityCollision = jest.fn();
global.GetDistanceBetweenCoords = jest.fn();
global.AddRope = jest.fn();
global.AttachEntitiesToRope = jest.fn();
global.RopeLoadTextures = jest.fn();
global.SetEntityVisible = jest.fn();
global.RopeUnloadTextures = jest.fn();
global.DeleteRope = jest.fn();

jest.useFakeTimers();

jest.mock("@brz-fivem-sdk/client/helpers/streaming", () => ({
  createPed: jest.fn(),
  playAnim: jest.fn(),
}));

jest.mock("./helpers/fishing.helper", () => ({
  getFishingSpot: jest.fn(),
}));

jest.mock("@brz-fivem-sdk/common/helpers", () => ({
  Delay: jest.fn(),
}));

describe("Client-side animations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("runCaughtFishAnimation", () => {
    let setTimeoutSpy: jest.SpyInstance;

    beforeAll(() => {
      setTimeoutSpy = jest.spyOn(global, "setTimeout");
    });

    beforeEach(() => {
      (GetEntityCoords as jest.Mock).mockReturnValueOnce([1, 2, 3]);
      (GetOffsetFromEntityInWorldCoords as jest.Mock).mockReturnValueOnce([
        4, 5, 6,
      ]);
      (GetEntityHeading as jest.Mock).mockReturnValueOnce(7);
    });

    it("should get the fishing spot for the player with a factor of 20 to spawn the fish used for the catch animation", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

      await runCaughtFishAnimation("fish");

      expect(getFishingSpot).toBeCalledWith(global.PlayerPedId(), 20);
    });

    it("should not cast the animation when the fishing spot couldn't be found", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce(null);

      await runCaughtFishAnimation("fish");

      expect(ModifyWater).not.toHaveBeenCalled();
      expect(createPed).not.toHaveBeenCalled();
      expect(ApplyForceToEntity).not.toHaveBeenCalled();
      expect(playAnim).not.toHaveBeenCalled();
      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it("should create a network ped that never dies with the fish model at the fishing spot and the Z axis with + 1", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);

      await runCaughtFishAnimation("hammerShark");

      expect(createPed).toBeCalledWith(
        0,
        1015224100,
        expect.any(Number),
        expect.any(Number),
        4,
        expect.any(Number),
        true,
        expect.any(Boolean)
      );

      expect(SetPedDiesWhenInjured).toBeCalledWith(1, false);
      expect(SetEntityInvincible).toBeCalledWith(1, true);
    });

    it("should create a tide wave the fish position", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

      await runCaughtFishAnimation("fish");

      expect(ModifyWater).toBeCalledWith(1, 2, 50, 200);
    });

    it("should throw the spawned fish towards the player's head", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);
      (GetOffsetFromEntityInWorldCoords as jest.Mock).mockReturnValueOnce([
        4, 5, 6,
      ]);

      await runCaughtFishAnimation("fish");

      expect(GetOffsetFromEntityInWorldCoords).toBeCalledWith(5, 0, -10, 8);
      expect(ApplyForceToEntity).toBeCalledWith(
        1,
        3,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        0,
        0,
        0,
        0,
        expect.any(Boolean),
        expect.any(Boolean),
        expect.any(Boolean),
        expect.any(Boolean),
        expect.any(Boolean)
      );
    });

    test.each(
      Object.keys(fishes).filter(
        (fishKey) => fishes[fishKey as keyof Fish].type === "legendary"
      )
    )(
      "should play a freakout player animation when the fish caught is the legedary %s",
      async (fishKey) => {
        (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

        await runCaughtFishAnimation(fishKey as keyof Fish);

        expect(playAnim).toBeCalledWith(
          "anim@mp_player_intcelebrationfemale@freakout",
          "freakout"
        );
      }
    );

    test.each(
      Object.keys(fishes).filter(
        (fishKey) =>
          fishes[fishKey as keyof Fish].type !== "common" &&
          fishes[fishKey as keyof Fish].type !== "legendary"
      )
    )(
      "should play a cheering player animation when the uncommon fish caught is %s",
      async (fishKey) => {
        (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

        await runCaughtFishAnimation(fishKey as keyof Fish);

        expect(playAnim).toBeCalledWith(
          "amb@world_human_cheering@female_a",
          "base"
        );
      }
    );

    test.each(
      Object.keys(fishes).filter(
        (fishKey) => fishes[fishKey as keyof Fish].type === "common"
      )
    )(
      "should not play a player animation when the fish caught is the common %s",
      async (fishKey) => {
        (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

        await runCaughtFishAnimation(fishKey as keyof Fish);

        expect(playAnim).not.toBeCalled();
      }
    );

    it("should delete the ped after 2 seconds", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);

      await runCaughtFishAnimation("fish");

      jest.advanceTimersByTime(2000);
      expect(DeletePed).toBeCalledWith(1);
    });
  });

  describe("stopFishingAnimation", () => {
    it("should clear all ped tasks and delete nearest rod object", () => {
      (GetEntityCoords as jest.Mock).mockReturnValueOnce([1, 2, 3]);
      (GetClosestObjectOfType as jest.Mock).mockReturnValueOnce(10);

      stopFishingAnimation();

      expect(ClearPedTasks).toBeCalledWith(5);
      expect(GetClosestObjectOfType).toBeCalledWith(
        1,
        2,
        3,
        10.0,
        "prop_fishing_rod_01",
        expect.any(Boolean),
        expect.any(Boolean),
        expect.any(Boolean)
      );
      expect(SetEntityAsMissionEntity).toHaveBeenCalledTimes(1);
      expect(DeleteEntity).toHaveBeenCalledWith(10);
    });

    it("should not try to delete rod if it's not found", () => {
      (GetEntityCoords as jest.Mock).mockReturnValueOnce([1, 2, 3]);
      (GetClosestObjectOfType as jest.Mock).mockReturnValueOnce(0);

      stopFishingAnimation();

      expect(SetEntityAsMissionEntity).not.toHaveBeenCalled();
      expect(DeleteEntity).not.toHaveBeenCalled();
    });
  });

  describe("performCastingAnimations", () => {
    it("should wait for 100ms before start casting animation", async () => {
      await performCastingAnimations();

      expect(Delay).toBeCalledWith(100);
    });

    it("should not perform animations when the fishing spot couldn't be retrieved", () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce(null);

      performCastingAnimations();

      expect(ModifyWater).not.toHaveBeenCalled();
      expect(RopeLoadTextures).not.toHaveBeenCalled();
      expect(AddRope).not.toHaveBeenCalled();
      expect(AttachEntitiesToRope).not.toHaveBeenCalled();
    });

    it("should modify the water to 50 height and 200 radius at the fishing spot", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

      await performCastingAnimations();

      expect(ModifyWater).toBeCalledWith(1, 2, 50, 200);
    });

    it("should create a fish ped with the fish model at the fishing spot", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);

      await performCastingAnimations();

      expect(createPed).toBeCalledWith(
        0,
        802685111,
        1,
        2,
        3,
        expect.any(Number),
        true,
        true
      );
    });

    it("should not attach fish to rope when fish ped is not available after being created", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(null);

      await performCastingAnimations();

      expect(SetEntityVisible).not.toHaveBeenCalled();
      expect(SetEntityInvincible).not.toHaveBeenCalled();
      expect(SetEntityCollision).not.toHaveBeenCalled();
      expect(AddRope).not.toHaveBeenCalled();
      expect(AttachEntitiesToRope).not.toHaveBeenCalled();
    });

    it("should set the fish ped to be invisible, invincible and not collidable", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);
      (GetDistanceBetweenCoords as jest.Mock).mockReturnValueOnce(10);
      (GetEntityCoords as jest.Mock).mockReturnValueOnce([1, 2, 3]);

      await performCastingAnimations();

      expect(SetEntityVisible).toBeCalledWith(1, false, false);
      expect(SetEntityInvincible).toBeCalledWith(1, true);
      expect(SetEntityCollision).toBeCalledWith(1, false, false);
    });

    it("should create rope and load its textures", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);
      (GetDistanceBetweenCoords as jest.Mock).mockReturnValueOnce(10);
      (GetEntityCoords as jest.Mock).mockReturnValueOnce([1, 2, 3]);

      await performCastingAnimations();

      expect(RopeLoadTextures).toBeCalledTimes(1);
      expect(AddRope).toBeCalledWith(
        1,
        2,
        3,
        0,
        0,
        0,
        40,
        5,
        10,
        15,
        0.7,
        expect.any(Boolean),
        expect.any(Boolean),
        expect.any(Boolean),
        expect.any(Number),
        expect.any(Boolean),
        expect.any(Number)
      );
    });

    it("should not attach fish to rope when rope couldn't be created", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);
      (GetEntityCoords as jest.Mock).mockReturnValueOnce([1, 2, 3]);
      (AddRope as jest.Mock).mockReturnValueOnce(0);

      await performCastingAnimations();

      expect(AttachEntitiesToRope).not.toHaveBeenCalled();
    });

    it("should not attach fish to rope when fish couldn't be created", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(0);
      (GetEntityCoords as jest.Mock).mockReturnValueOnce([1, 2, 3]);

      await performCastingAnimations();

      expect(AttachEntitiesToRope).not.toHaveBeenCalled();
    });

    it("should attach fish to rope with the player", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);
      (GetEntityCoords as jest.Mock).mockReturnValue([1, 2, 3]);
      (AddRope as jest.Mock).mockReturnValueOnce([1, 1]);
      (GetClosestObjectOfType as jest.Mock).mockReturnValueOnce(5);
      (GetDistanceBetweenCoords as jest.Mock).mockReturnValue(100);

      await performCastingAnimations();

      expect(AttachEntitiesToRope).toBeCalledWith(
        1,
        5,
        1,
        4,
        5,
        6,
        1,
        2,
        3,
        100,
        expect.any(Boolean),
        expect.any(Boolean),
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe("stopCastingAnimations", () => {
    it("should not delete the fish ped and rope when they're not defined", () => {
      stopFishingAnimation();

      expect(DeletePed).not.toHaveBeenCalled();
      expect(DeleteEntity).not.toHaveBeenCalled();
    });

    it("should delete the fish ped and when it's defined", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);
      (GetDistanceBetweenCoords as jest.Mock).mockReturnValueOnce(10);
      (GetEntityCoords as jest.Mock).mockReturnValue([1, 2, 3]);

      await performCastingAnimations();

      stopCastingAnimations();

      expect(DeletePed).toBeCalledWith(1);
    });

    it("should delete the rope when it's defined", async () => {
      (getFishingSpot as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
      (createPed as jest.Mock).mockResolvedValueOnce(1);
      (GetDistanceBetweenCoords as jest.Mock).mockReturnValueOnce(10);
      (GetEntityCoords as jest.Mock).mockReturnValue([1, 2, 3]);
      (AddRope as jest.Mock).mockReturnValueOnce([1, 1]);

      await performCastingAnimations();

      stopCastingAnimations();

      expect(RopeUnloadTextures).toHaveBeenCalledTimes(1);
      expect(DeleteRope).toBeCalledWith(1);
    });
  });

  describe("getters", () => {
    it("should return the fish ped", () => {
      expect(getFishPed()).toBeDefined();
    });

    it("should return the fish rope", () => {
      expect(getFishRope()).toBeDefined();
    });
  });
});
