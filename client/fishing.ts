import {
  EmitFishingAction,
  Fish,
  InternalClientEvents,
  UnableToFishReason,
} from "@common/types";
import {
  getFishingParam,
  getState,
  resetFishingParams,
  setFishingParam,
  setState,
} from "./state";
import { emitNetTyped } from "@core/helpers/cfx";
import { hasItem, notify } from "@core/thirdparties.service";
import { t } from "@config/locales";
import {
  runCaughtFishAnimation,
  stopCastingAnimations,
  stopFishingAnimation,
} from "./animations";
import { getFishingSpot } from "./helpers/fishing.helper";

export const startFishing = async (source: number, fishId: keyof Fish) => {
  try {
    if (await canStartFishing(source)) {
      resetFishingParams();

      setFishingParam<"fishId">("fishId", fishId);

      SetNuiFocus(false, false);

      TaskStartScenarioInPlace(
        PlayerPedId(),
        "WORLD_HUMAN_STAND_FISHING",
        0,
        true
      );

      SendNUIMessage({ action: "start-fishing" } as EmitFishingAction);

      setState("casting");
      notify(t("fishing_state"), "success");
    }
  } catch (error: any) {
    notify(error.message, "error");
  }
};

export const requestStartFishing = async () =>
  emitNetTyped<InternalClientEvents, "brz-fishing:requestStartFishing">(
    "brz-fishing:requestStartFishing",
    GetPlayerServerId(PlayerId())
  );

export const stopFishing = () => {
  SetNuiFocus(false, false);
  SendNUIMessage({ action: "stop-fishing" } as EmitFishingAction);

  stopFishingAnimation();
  stopCastingAnimations();

  resetFishingParams();
};

export const useBait = () => {
  emitNetTyped<InternalClientEvents, "brz-fishing:useBait">(
    "brz-fishing:useBait",
    GetPlayerServerId(PlayerId())
  );
};

export const catchFish = () => {
  runCaughtFishAnimation(getFishingParam("fishId") as keyof Fish);
  emitNetTyped<InternalClientEvents, "brz-fishing:catchFish">(
    "brz-fishing:catchFish",
    GetPlayerServerId(PlayerId())
  );
};

const canStartFishing = async (
  player: number
): Promise<true | UnableToFishReason> => {
  const playerPed = GetPlayerPed(player);

  const conditions = {
    isntFishing: {
      tick: getState() === "not-fishing",
      message: t("already_fishing_error"),
    },
    notInVehicle: {
      tick: !IsPedInAnyVehicle(playerPed, false),
      message: t("in_vehicle_error"),
    },
    hasRod: {
      tick: hasItem("fishingrod1"),
      message: t("has_rod_error"),
    },
    hasBait: {
      tick: hasItem("commonbait"),
      message: t("has_bait_error"),
    },
    inFishingSpot: {
      tick: !!(await getFishingSpot(PlayerPedId())),
      message: t("fishing_spot_error"),
    },
  };

  const failedCondition = Object.values(conditions).find(
    (condition) => !condition.tick
  );

  if (failedCondition) {
    throw new Error(failedCondition.message);
  }

  return true;
};
